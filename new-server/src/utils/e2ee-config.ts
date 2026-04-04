const parseBooleanFlag = (value?: string) => {
  const normalized = value?.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
};

const isE2EEEnabled = () => parseBooleanFlag(process.env.E2EE_ENABLED);

const getMessageSecurityMode = (encryptedPayloadDetected: boolean) => {
  if (!isE2EEEnabled()) return "disabled";
  return encryptedPayloadDetected ? "encrypted" : "legacy";
};

export {isE2EEEnabled, getMessageSecurityMode, parseBooleanFlag};
