import crypto from "node:crypto";

export function hmacSha256(input: string, salt: string) {
	return crypto.createHmac("sha256", salt).update(input, "utf8").digest("hex");
}
