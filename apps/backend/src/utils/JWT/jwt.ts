// @ts-nocheck
import jwt from "jsonwebtoken";
import { jwtSettings } from "../../lib/env.js";

export const generateJWT = (
	payload: Record<string, string | number | boolean>,
): string => {
	const secret = jwtSettings.secret as jwt.Secret;

	const expiresIn = jwtSettings.expiresIn; // デフォルト指定あり

	if (!secret || !expiresIn) {
		throw new Error("JWT_SECRET is not defined");
	}

	return jwt.sign(payload, secret, {
		expiresIn,
	});
};
