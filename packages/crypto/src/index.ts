import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
}

function getMasterKey(): Buffer {
  const b64 = process.env.VAULT_MASTER_KEY;
  if (!b64) {
    throw new Error("VAULT_MASTER_KEY is not set");
  }
  const key = Buffer.from(b64, "base64");
  if (key.length !== KEY_LENGTH) {
    throw new Error("VAULT_MASTER_KEY must be 32 bytes (base64-encoded)");
  }
  return key;
}

export function deriveUserKey(password: string, salt: string): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100_000, KEY_LENGTH, "sha512");
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function encryptBuffer(data: Buffer, key?: Buffer): EncryptedPayload {
  const encKey = key ?? getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, encKey, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

export function decryptBuffer(payload: EncryptedPayload, key?: Buffer): Buffer {
  const encKey = key ?? getMasterKey();
  const iv = Buffer.from(payload.iv, "base64");
  const authTag = Buffer.from(payload.authTag, "base64");
  const ciphertext = Buffer.from(payload.ciphertext, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, encKey, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

export function encryptString(text: string, key?: Buffer): EncryptedPayload {
  return encryptBuffer(Buffer.from(text, "utf8"), key);
}

export function decryptString(payload: EncryptedPayload, key?: Buffer): string {
  return decryptBuffer(payload, key).toString("utf8");
}

export function serializeEncrypted(payload: EncryptedPayload): string {
  return JSON.stringify(payload);
}

export function parseEncrypted(serialized: string): EncryptedPayload {
  return JSON.parse(serialized) as EncryptedPayload;
}

export function hashChecksum(data: Buffer): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}
