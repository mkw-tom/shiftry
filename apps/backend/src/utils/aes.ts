// src/utils/aes.ts
import crypto from "node:crypto";

function assertKey(keyB64: string) {
	const buf = Buffer.from(keyB64, "base64");
	if (buf.length !== 32)
		throw new Error("AES key must be 32-byte base64 (AES-256)");
	return buf;
}

export function encryptText(plain: string, keyB64: string, keyVersion: string) {
	const KEY = assertKey(keyB64);
	const iv = crypto.randomBytes(12); // GCMは12byte推奨
	const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
	const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
	const tag = cipher.getAuthTag();
	// フォーマット: version:iv:data:tag
	return `${keyVersion}:${iv.toString("base64")}:${enc.toString("base64")}:${tag.toString("base64")}`;
}

export function decryptText(blob: string, keyRing: Record<string, string>) {
	const [ver, ivB64, dataB64, tagB64] = blob.split(":");
	if (!ver || !ivB64 || !dataB64 || !tagB64)
		throw new Error("Invalid enc blob");
	const keyB64 = keyRing[ver];
	if (!keyB64) throw new Error(`Unknown key version: ${ver}`);

	const KEY = assertKey(keyB64);
	const iv = Buffer.from(ivB64, "base64");
	const data = Buffer.from(dataB64, "base64");
	const tag = Buffer.from(tagB64, "base64");

	const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
	decipher.setAuthTag(tag);
	const dec = Buffer.concat([decipher.update(data), decipher.final()]);
	return dec.toString("utf8");
}
