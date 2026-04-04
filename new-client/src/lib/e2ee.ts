import axios from "axios";

const KEY_ALGORITHM = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
} as const;

const WRAP_ALGORITHM = {name: "AES-GCM", length: 256} as const;
const KDF_ITERATIONS = 250000;
const pendingRecoveryKeyStorageKey = "noviconnect:e2ee:pending-recovery-key";

const privateKeyStorageKey = (userId: string) => `noviconnect:e2ee:private:${userId}`;
const publicKeyStorageKey = (userId: string) => `noviconnect:e2ee:public:${userId}`;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
};

const base64ToArrayBuffer = (value: string) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
};

const exportPublicKey = async (key: CryptoKey) => arrayBufferToBase64(await crypto.subtle.exportKey("spki", key));
const exportPrivateKey = async (key: CryptoKey) => arrayBufferToBase64(await crypto.subtle.exportKey("pkcs8", key));

const importPublicKey = async (key: string) =>
  crypto.subtle.importKey("spki", base64ToArrayBuffer(key), KEY_ALGORITHM, true, ["encrypt"]);

const importPrivateKey = async (key: string) =>
  crypto.subtle.importKey("pkcs8", base64ToArrayBuffer(key), KEY_ALGORITHM, true, ["decrypt"]);

const importPasswordMaterial = (password: string) =>
  crypto.subtle.importKey("raw", textEncoder.encode(password), "PBKDF2", false, ["deriveKey"]);

const deriveWrapKey = async ({
  password,
  salt,
  iterations,
}: {
  password: string;
  salt: Uint8Array;
  iterations: number;
}) => {
  const material = await importPasswordMaterial(password);

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    material,
    WRAP_ALGORITHM,
    false,
    ["encrypt", "decrypt"]
  );
};

const loadLocalIdentity = async (userId: string) => {
  const privateKey = localStorage.getItem(privateKeyStorageKey(userId));
  const publicKey = localStorage.getItem(publicKeyStorageKey(userId));

  if (!privateKey || !publicKey) return null;

  return {privateKey, publicKey};
};

const storeLocalIdentity = ({userId, privateKey, publicKey}: {userId: string; privateKey: string; publicKey: string}) => {
  localStorage.setItem(privateKeyStorageKey(userId), privateKey);
  localStorage.setItem(publicKeyStorageKey(userId), publicKey);
};

const generateRecoveryKey = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const randomValues = crypto.getRandomValues(new Uint8Array(20));
  const segments = [];

  for (let i = 0; i < 5; i += 1) {
    let segment = "";
    for (let j = 0; j < 4; j += 1) {
      const index = randomValues[i * 4 + j] % alphabet.length;
      segment += alphabet[index];
    }
    segments.push(segment);
  }

  return segments.join("-");
};

const createAndStoreLocalIdentity = async (userId: string) => {
  const keyPair = await crypto.subtle.generateKey(KEY_ALGORITHM, true, ["encrypt", "decrypt"]);
  const [publicKey, privateKey] = await Promise.all([
    exportPublicKey(keyPair.publicKey),
    exportPrivateKey(keyPair.privateKey),
  ]);

  storeLocalIdentity({userId, privateKey, publicKey});

  return {privateKey, publicKey};
};

const getPrivateKey = async (userId: string) => {
  const identity = await loadLocalIdentity(userId);
  if (!identity) throw new Error("Encrypted messages are unavailable on this device.");
  return importPrivateKey(identity.privateKey);
};

const createEncryptedEnvelope = async ({
  data,
  members,
}: {
  data: ArrayBuffer;
  members: Array<{_id: string; encryptionPublicKey?: string}>;
}) => {
  const unavailableMember = members.find((member) => !member.encryptionPublicKey);
  if (unavailableMember) {
    throw new Error("One or more chat members have not finished secure-message setup yet.");
  }

  const symmetricKey = await crypto.subtle.generateKey({name: "AES-GCM", length: 256}, true, ["encrypt", "decrypt"]);
  const rawSymmetricKey = await crypto.subtle.exportKey("raw", symmetricKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    {name: "AES-GCM", iv},
    symmetricKey,
    data
  );

  const encryptedKeys = await Promise.all(
    members.map(async (member) => {
      const importedKey = await importPublicKey(member.encryptionPublicKey as string);
      const encryptedKey = await crypto.subtle.encrypt({name: "RSA-OAEP"}, importedKey, rawSymmetricKey);

      return {
        userId: member._id,
        key: arrayBufferToBase64(encryptedKey),
      };
    })
  );

  return {
    version: 1,
    algorithm: "AES-GCM",
    ciphertext,
    iv: arrayBufferToBase64(iv.buffer),
    encryptedKeys,
  };
};

const createEncryptedPrivateKeyBundle = async ({
  privateKey,
  password,
}: {
  privateKey: string;
  password: string;
}) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrapKey = await deriveWrapKey({
    password,
    salt,
    iterations: KDF_ITERATIONS,
  });
  const encryptedPrivateKey = await crypto.subtle.encrypt(
    {name: "AES-GCM", iv},
    wrapKey,
    base64ToArrayBuffer(privateKey)
  );

  return {
    encryptedPrivateKeyBundle: arrayBufferToBase64(encryptedPrivateKey),
    encryptionBundleIv: arrayBufferToBase64(iv.buffer),
    encryptionBundleSalt: arrayBufferToBase64(salt.buffer),
    encryptionBundleIterations: KDF_ITERATIONS,
    encryptionKeyVersion: 1,
  };
};

const createRecoveryKeyBundle = async ({
  privateKey,
  recoveryKey,
}: {
  privateKey: string;
  recoveryKey: string;
}) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrapKey = await deriveWrapKey({
    password: recoveryKey,
    salt,
    iterations: KDF_ITERATIONS,
  });
  const encryptedPrivateKey = await crypto.subtle.encrypt(
    {name: "AES-GCM", iv},
    wrapKey,
    base64ToArrayBuffer(privateKey)
  );

  return {
    encryptedRecoveryKeyBundle: arrayBufferToBase64(encryptedPrivateKey),
    recoveryBundleIv: arrayBufferToBase64(iv.buffer),
    recoveryBundleSalt: arrayBufferToBase64(salt.buffer),
  };
};

const decryptPrivateKeyBundle = async ({
  encryptedPrivateKeyBundle,
  encryptionBundleIv,
  encryptionBundleSalt,
  encryptionBundleIterations,
  password,
}: {
  encryptedPrivateKeyBundle: string;
  encryptionBundleIv: string;
  encryptionBundleSalt: string;
  encryptionBundleIterations: number;
  password: string;
}) => {
  const iv = new Uint8Array(base64ToArrayBuffer(encryptionBundleIv));
  const salt = new Uint8Array(base64ToArrayBuffer(encryptionBundleSalt));
  const wrapKey = await deriveWrapKey({
    password,
    salt,
    iterations: Number(encryptionBundleIterations) || KDF_ITERATIONS,
  });
  const decryptedKey = await crypto.subtle.decrypt(
    {name: "AES-GCM", iv},
    wrapKey,
    base64ToArrayBuffer(encryptedPrivateKeyBundle)
  );

  return arrayBufferToBase64(decryptedKey);
};

const saveEncryptionBundle = async ({
  server,
  encryptionPublicKey,
  privateKey,
  password,
  recoveryKey,
}: {
  server: string;
  encryptionPublicKey: string;
  privateKey: string;
  password: string;
  recoveryKey?: string;
}) => {
  const bundle = await createEncryptedPrivateKeyBundle({privateKey, password});
  const recoveryBundle = recoveryKey
    ? await createRecoveryKeyBundle({privateKey, recoveryKey})
    : {};

  await axios.put(
    `${server}/api/v1/user/encryption-bundle`,
    {
      encryptionPublicKey,
      ...bundle,
      ...recoveryBundle,
    },
    {withCredentials: true}
  );
};

export const ensureUserEncryptionSetup = async ({
  user,
  server,
  password,
}: {
  user: {_id: string; encryptionPublicKey?: string};
  server: string;
  password?: string;
}) => {
  if (!user?._id) return null;

  const localIdentity = await loadLocalIdentity(user._id);
  if (localIdentity) {
    if (user.encryptionPublicKey !== localIdentity.publicKey && password) {
      const recoveryKey = generateRecoveryKey();
      await saveEncryptionBundle({
        server,
        encryptionPublicKey: localIdentity.publicKey,
        privateKey: localIdentity.privateKey,
        password,
        recoveryKey,
      });
      sessionStorage.setItem(pendingRecoveryKeyStorageKey, recoveryKey);
    }

    return {
      restoredFromBundle: false,
      uploadedBundle: Boolean(password && user.encryptionPublicKey !== localIdentity.publicKey),
      recoveryKey: sessionStorage.getItem(pendingRecoveryKeyStorageKey),
    };
  }

  const {data} = await axios.get(`${server}/api/v1/user/encryption-bundle`, {withCredentials: true});
  const bundle = data?.encryptionBundle;

  if (bundle?.encryptedPrivateKeyBundle && password) {
    try {
      const privateKey = await decryptPrivateKeyBundle({
        encryptedPrivateKeyBundle: bundle.encryptedPrivateKeyBundle,
        encryptionBundleIv: bundle.encryptionBundleIv,
        encryptionBundleSalt: bundle.encryptionBundleSalt,
        encryptionBundleIterations: bundle.encryptionBundleIterations,
        password,
      });

      storeLocalIdentity({
        userId: user._id,
        privateKey,
        publicKey: bundle.encryptionPublicKey,
      });

      return {restoredFromBundle: true, uploadedBundle: false, recoveryKey: sessionStorage.getItem(pendingRecoveryKeyStorageKey)};
    } catch (error) {
      if (bundle?.hasRecoveryKey) {
        return {restoredFromBundle: false, uploadedBundle: false, needsRecoveryKey: true};
      }
      throw error;
    }
  }

  if (!password) {
    return {restoredFromBundle: false, uploadedBundle: false, needsRecoveryKey: Boolean(bundle?.hasRecoveryKey)};
  }

  const identity = await createAndStoreLocalIdentity(user._id);
  const recoveryKey = generateRecoveryKey();
  await saveEncryptionBundle({
    server,
    encryptionPublicKey: identity.publicKey,
    privateKey: identity.privateKey,
    password,
    recoveryKey,
  });
  sessionStorage.setItem(pendingRecoveryKeyStorageKey, recoveryKey);

  return {restoredFromBundle: false, uploadedBundle: true, recoveryKey};
};

export const rewrapEncryptionBundle = async ({
  userId,
  currentPassword,
  newPassword,
  server,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
  server: string;
}) => {
  if (!userId) throw new Error("User not available for encryption key rotation.");

  let identity = await loadLocalIdentity(userId);

  if (!identity) {
    const {data} = await axios.get(`${server}/api/v1/user/encryption-bundle`, {withCredentials: true});
    const bundle = data?.encryptionBundle;

    if (!bundle?.encryptedPrivateKeyBundle) {
      throw new Error("No encrypted private key bundle found for this account.");
    }

    const privateKey = await decryptPrivateKeyBundle({
      encryptedPrivateKeyBundle: bundle.encryptedPrivateKeyBundle,
      encryptionBundleIv: bundle.encryptionBundleIv,
      encryptionBundleSalt: bundle.encryptionBundleSalt,
      encryptionBundleIterations: bundle.encryptionBundleIterations,
      password: currentPassword,
    });

    identity = {
      privateKey,
      publicKey: bundle.encryptionPublicKey,
    };

    storeLocalIdentity({userId, ...identity});
  }

  await saveEncryptionBundle({
    server,
    encryptionPublicKey: identity.publicKey,
    privateKey: identity.privateKey,
    password: newPassword,
  });
};

export const clearEncryptionIdentity = (userId?: string) => {
  if (!userId) return;
  localStorage.removeItem(privateKeyStorageKey(userId));
  localStorage.removeItem(publicKeyStorageKey(userId));
};

export const getPendingRecoveryKey = () => sessionStorage.getItem(pendingRecoveryKeyStorageKey);
export const clearPendingRecoveryKey = () => sessionStorage.removeItem(pendingRecoveryKeyStorageKey);

export const restoreEncryptionWithRecoveryKey = async ({
  userId,
  recoveryKey,
  password,
  server,
}: {
  userId: string;
  recoveryKey: string;
  password: string;
  server: string;
}) => {
  const {data} = await axios.get(`${server}/api/v1/user/encryption-bundle`, {withCredentials: true});
  const bundle = data?.encryptionBundle;

  if (!bundle?.encryptedRecoveryKeyBundle || !bundle?.recoveryBundleIv || !bundle?.recoveryBundleSalt) {
    throw new Error("No recovery key bundle is available for this account.");
  }

  const privateKey = await decryptPrivateKeyBundle({
    encryptedPrivateKeyBundle: bundle.encryptedRecoveryKeyBundle,
    encryptionBundleIv: bundle.recoveryBundleIv,
    encryptionBundleSalt: bundle.recoveryBundleSalt,
    encryptionBundleIterations: KDF_ITERATIONS,
    password: recoveryKey,
  });

  storeLocalIdentity({
    userId,
    privateKey,
    publicKey: bundle.encryptionPublicKey,
  });

  await saveEncryptionBundle({
    server,
    encryptionPublicKey: bundle.encryptionPublicKey,
    privateKey,
    password,
    recoveryKey,
  });
};

export const regenerateRecoveryKey = async ({
  userId,
  password,
  server,
}: {
  userId: string;
  password: string;
  server: string;
}) => {
  const identity = await loadLocalIdentity(userId);
  if (!identity) throw new Error("Local secure identity is unavailable on this device.");

  const recoveryKey = generateRecoveryKey();
  await saveEncryptionBundle({
    server,
    encryptionPublicKey: identity.publicKey,
    privateKey: identity.privateKey,
    password,
    recoveryKey,
  });

  sessionStorage.setItem(pendingRecoveryKeyStorageKey, recoveryKey);

  return recoveryKey;
};

export const encryptTextMessage = async ({
  text,
  members,
}: {
  text: string;
  members: Array<{_id: string; encryptionPublicKey?: string}>;
}) => {
  if (!text.trim()) throw new Error("Message cannot be empty.");
  const envelope = await createEncryptedEnvelope({
    data: textEncoder.encode(text),
    members,
  });

  return {
    version: 1,
    algorithm: "AES-GCM",
    ciphertext: arrayBufferToBase64(envelope.ciphertext),
    iv: envelope.iv,
    encryptedKeys: envelope.encryptedKeys,
  };
};

export const encryptAttachmentsForUpload = async ({
  files,
  members,
}: {
  files: File[];
  members: Array<{_id: string; encryptionPublicKey?: string}>;
}) => {
  const encryptedFiles = await Promise.all(
    files.map(async (file) => {
      const encryptedEnvelope = await createEncryptedEnvelope({
        data: await file.arrayBuffer(),
        members,
      });

      return {
        file: new File(
          [encryptedEnvelope.ciphertext],
          `${file.name}.enc`,
          {type: "application/octet-stream"}
        ),
        metadata: {
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          isEncrypted: true,
          encryptedFile: {
            version: 1,
            algorithm: "AES-GCM",
            iv: encryptedEnvelope.iv,
            encryptedKeys: encryptedEnvelope.encryptedKeys,
          },
        },
      };
    })
  );

  return encryptedFiles;
};

export const decryptMessageContent = async ({
  message,
  userId,
}: {
  message: any;
  userId: string;
}) => {
  if (!message?.encryptedContent?.ciphertext) {
    return {
      ...message,
      e2eeState: message?.content ? "legacy" : undefined,
    };
  }

  try {
    const privateKey = await getPrivateKey(userId);
    const encryptedKey = message.encryptedContent.encryptedKeys?.find(
      (entry: any) => entry.userId?.toString?.() === userId || entry.userId === userId
    );

    if (!encryptedKey?.key) {
      return {
        ...message,
        content: "Encrypted message unavailable on this device.",
        e2eeState: "unavailable",
      };
    }

    const rawSymmetricKey = await crypto.subtle.decrypt(
      {name: "RSA-OAEP"},
      privateKey,
      base64ToArrayBuffer(encryptedKey.key)
    );
    const symmetricKey = await crypto.subtle.importKey(
      "raw",
      rawSymmetricKey,
      {name: "AES-GCM"},
      false,
      ["decrypt"]
    );
    const plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(base64ToArrayBuffer(message.encryptedContent.iv)),
      },
      symmetricKey,
      base64ToArrayBuffer(message.encryptedContent.ciphertext)
    );

    return {
      ...message,
      content: textDecoder.decode(plaintext),
      e2eeState: "encrypted",
    };
  } catch (error) {
    return {
      ...message,
      content: "Encrypted message unavailable on this device.",
      e2eeState: "unavailable",
    };
  }
};

export const decryptAttachmentBlob = async ({
  attachment,
  userId,
}: {
  attachment: any;
  userId: string;
}) => {
  if (!attachment?.isEncrypted || !attachment?.encryptedFile?.encryptedKeys?.length) {
    return {
      url: attachment?.url,
      mimeType: attachment?.mimeType,
      originalName: attachment?.originalName,
      isEncrypted: false,
    };
  }

  const privateKey = await getPrivateKey(userId);
  const encryptedKey = attachment.encryptedFile.encryptedKeys.find(
    (entry: any) => entry.userId?.toString?.() === userId || entry.userId === userId
  );

  if (!encryptedKey?.key) {
    throw new Error("Attachment cannot be decrypted on this device.");
  }

  const response = await fetch(attachment.url);
  const encryptedBuffer = await response.arrayBuffer();
  const rawSymmetricKey = await crypto.subtle.decrypt(
    {name: "RSA-OAEP"},
    privateKey,
    base64ToArrayBuffer(encryptedKey.key)
  );
  const symmetricKey = await crypto.subtle.importKey(
    "raw",
    rawSymmetricKey,
    {name: "AES-GCM"},
    false,
    ["decrypt"]
  );
  const plaintext = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(base64ToArrayBuffer(attachment.encryptedFile.iv)),
    },
    symmetricKey,
    encryptedBuffer
  );

  const blob = new Blob([plaintext], {type: attachment.mimeType || "application/octet-stream"});
  return {
    url: URL.createObjectURL(blob),
    mimeType: attachment.mimeType,
    originalName: attachment.originalName,
    isEncrypted: true,
  };
};
