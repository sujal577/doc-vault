import fs from "fs/promises";
import path from "path";
import {
  encryptBuffer,
  decryptBuffer,
  encryptString,
  decryptString,
  serializeEncrypted,
  parseEncrypted,
  hashChecksum,
  type EncryptedPayload,
} from "@doc-vault/crypto";

const STORAGE_PATH = process.env.STORAGE_PATH ?? path.join(process.cwd(), "uploads");

export async function ensureStorageDir(): Promise<void> {
  await fs.mkdir(STORAGE_PATH, { recursive: true });
}

export function storagePathFor(key: string): string {
  return path.join(STORAGE_PATH, key);
}

export async function saveEncryptedFile(relativeKey: string, data: Buffer): Promise<{ key: string; checksum: string }> {
  await ensureStorageDir();
  const encrypted = encryptBuffer(data);
  const fullPath = storagePathFor(relativeKey);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, serializeEncrypted(encrypted));
  return { key: relativeKey, checksum: hashChecksum(data) };
}

export async function readEncryptedFile(relativeKey: string): Promise<Buffer> {
  const raw = await fs.readFile(storagePathFor(relativeKey), "utf8");
  const payload = parseEncrypted(raw);
  return decryptBuffer(payload);
}

export function encryptMetadata(metadata: Record<string, unknown>): string {
  return serializeEncrypted(encryptString(JSON.stringify(metadata)));
}

export function decryptMetadata(serialized: string): Record<string, unknown> {
  try {
    const payload = parseEncrypted(serialized);
    return JSON.parse(decryptString(payload)) as Record<string, unknown>;
  } catch {
    try {
      return JSON.parse(serialized) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
}

export function encryptOcrText(text: string): string {
  return serializeEncrypted(encryptString(text));
}

export function decryptOcrText(serialized: string | null): string | null {
  if (!serialized) return null;
  try {
    return decryptString(parseEncrypted(serialized));
  } catch {
    return serialized;
  }
}

export async function fileExists(relativeKey: string): Promise<boolean> {
  try {
    await fs.access(storagePathFor(relativeKey));
    return true;
  } catch {
    return false;
  }
}
