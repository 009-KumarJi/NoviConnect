import test from "node:test";
import assert from "node:assert/strict";

import {getMessageSecurityMode, parseBooleanFlag} from "./e2ee-config.js";

test("parseBooleanFlag accepts common truthy values", () => {
  assert.equal(parseBooleanFlag("true"), true);
  assert.equal(parseBooleanFlag("1"), true);
  assert.equal(parseBooleanFlag("YES"), true);
  assert.equal(parseBooleanFlag("on"), true);
});

test("parseBooleanFlag rejects falsey values", () => {
  assert.equal(parseBooleanFlag("false"), false);
  assert.equal(parseBooleanFlag("0"), false);
  assert.equal(parseBooleanFlag(undefined), false);
});

test("getMessageSecurityMode reports disabled when flag is off", () => {
  const previous = process.env.E2EE_ENABLED;
  process.env.E2EE_ENABLED = "false";
  assert.equal(getMessageSecurityMode(true), "disabled");
  assert.equal(getMessageSecurityMode(false), "disabled");
  process.env.E2EE_ENABLED = previous;
});

test("getMessageSecurityMode distinguishes encrypted and legacy when flag is on", () => {
  const previous = process.env.E2EE_ENABLED;
  process.env.E2EE_ENABLED = "true";
  assert.equal(getMessageSecurityMode(true), "encrypted");
  assert.equal(getMessageSecurityMode(false), "legacy");
  process.env.E2EE_ENABLED = previous;
});
