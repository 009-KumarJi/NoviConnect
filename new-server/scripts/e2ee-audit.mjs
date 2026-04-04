import {readFileSync} from "node:fs";
import {resolve} from "node:path";

const root = resolve(process.cwd());

const checks = [
  {
    label: "server flag",
    path: "src/utils/e2ee-config.ts",
    pattern: /isE2EEEnabled/,
  },
  {
    label: "message schema encrypted payload",
    path: "src/models/message.model.ts",
    pattern: /encryptedContent/,
  },
  {
    label: "user recovery bundle",
    path: "src/models/user.model.ts",
    pattern: /encryptedRecoveryKeyBundle/,
  },
  {
    label: "bundle endpoint",
    path: "src/routes/user.routes.ts",
    pattern: /encryption-bundle/,
  },
  {
    label: "reset endpoint",
    path: "src/routes/user.routes.ts",
    pattern: /encryption-state/,
  },
  {
    label: "encrypted attachment schema",
    path: "src/models/message.model.ts",
    pattern: /encryptedFile/,
  },
  {
    label: "attachment metadata handling",
    path: "src/controllers/chat.controller.ts",
    pattern: /attachmentMetadata|isEncrypted/,
  },
  {
    label: "secure server message logging removed",
    path: "src/server.ts",
    pattern: /Message received for chat/,
  },
];

const forbiddenPatterns = [
  {
    label: "plaintext message debug log",
    path: "src/server.ts",
    pattern: /New message received|sout\("New message received|console\.log\(e\)/i,
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

console.log("E2EE audit passed.");
