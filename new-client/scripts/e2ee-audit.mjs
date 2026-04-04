import {readFileSync} from "node:fs";
import {resolve} from "node:path";

const root = resolve(process.cwd());

const checks = [
  {
    label: "client flag",
    path: "src/constants/config.constant.ts",
    pattern: /VITE_E2EE_ENABLED/,
  },
  {
    label: "chat encrypt flow",
    path: "src/pages/Chat.tsx",
    pattern: /encryptTextMessage/,
  },
  {
    label: "decrypt render flow",
    path: "src/pages/Chat.tsx",
    pattern: /decryptMessageContent/,
  },
  {
    label: "message trust state",
    path: "src/components/shared/MessageComponent.tsx",
    pattern: /Encrypted|Legacy|Secure message unavailable/,
  },
  {
    label: "attachment encryption flow",
    path: "src/components/dialogs/FileMenu.tsx",
    pattern: /encryptAttachmentsForUpload/,
  },
  {
    label: "attachment decryption flow",
    path: "src/components/shared/RenderAttachment.tsx",
    pattern: /decryptAttachmentBlob/,
  },
];

const forbiddenPatterns = [
  {
    label: "chat plaintext debug log",
    path: "src/pages/Chat.tsx",
    pattern: /sout\(.*typing|sout\(.*Alert Listener|console\.log\(/i,
  },
];

let failures = 0;

for (const check of checks) {
  const filePath = resolve(root, check.path);
  const contents = readFileSync(filePath, "utf8");

  if (!check.pattern.test(contents)) {
    console.error(`E2EE audit failed: missing ${check.label} in ${check.path}`);
    failures += 1;
  }
}

for (const check of forbiddenPatterns) {
  const filePath = resolve(root, check.path);
  const contents = readFileSync(filePath, "utf8");

  if (check.pattern.test(contents)) {
    console.error(`E2EE audit failed: forbidden ${check.label} in ${check.path}`);
    failures += 1;
  }
}

if (failures > 0) {
  process.exit(1);
}

console.log("E2EE client audit passed.");
