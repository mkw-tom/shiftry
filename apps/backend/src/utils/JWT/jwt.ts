// @ts-nocheck
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../lib/env";

export const generateJWT = (
	payload: Record<string, string | number | boolean>,
): string => {
	const secret = JWT_SECRET as jwt.Secret;

	const expiresIn = JWT_EXPIRES_IN || "7d"; // デフォルト指定あり

	if (!secret || !expiresIn) {
		throw new Error("JWT_SECRET is not defined");
	}

	return jwt.sign(payload, secret, {
		expiresIn,
	});
};
