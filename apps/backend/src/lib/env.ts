import type { SignOptions } from "jsonwebtoken";

/// ポート
export const PORT = process.env.PORT as string;

/// クロスオリジン
export const CROSS_ORIGIN_PROD = process.env.CROSS_ORIGIN_PROD as string;
export const CROSS_ORIGIN_DEV = process.env.CROSS_ORIGIN_DEV as string;
export const CROSS_ORIGIN_LIFF = process.env.CROSS_ORIGIN_LIFF as string;

export const DATABASE_URL = process.env.DATABASE_URL as string;

/// lineMessageAPI
export const LINE_API_URL = process.env.LINE_API_URL as string;

export const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID as string;
export const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET as string;
export const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN as string;

export const lineMessageChannel = {
	id: process.env.LINE_MESSAGING_CHANNEL_ID as string,
	secret: process.env.LINE_MESSAGING_CHANNEL_SECRET as string,
	accessToken: process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN as string,
};

/// LINE-AUTH
export const LINE_AUTH_CHANNEL_ID = process.env.LINE_AUTH_CHANNEL_ID as string;
export const LINE_AUTH_CHANNEL_SECRET = process.env
	.LINE_AUTH_CHANNEL_SECRET as string;

export const lineLoginChannel = {
	id: process.env.LINE_LOGIN_CHANNEL_ID,
	secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
};
export const LINE_AUTH_REDIRECT_URI = process.env
	.LINE_AUTH_REDIRECT_URI as string;

/// JWT
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;
export const jwtSettings = {
	secret: process.env.JWT_SECRET as string,
	expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"], // デフォルトは15分
};

/// AES
export const aes = {
	keyLineId: process.env.ENCRYPTION_KEY_LINE_ID as string,
	keyGroupId: process.env.ENCRYPTION_KEY_GROUP_ID as string,
	keyStoreCode: process.env.ENCRYPTION_KEY_STORE_CODE as string,
	keyVersionLineId: process.env.KEY_VERSION_AES_LINE_ID as string,
	keyVersionGroupId: process.env.KEY_VERSION_AES_GROUP_ID as string,
	keyVersionStoreCode: process.env.KEY_VERSION_AES_STORE_CODE as string,
};

/// HMAC
export const hmac = {
	saltLineId: process.env.HASH_SALT_LINE_ID as string,
	saltGroupId: process.env.HASH_SALT_GROUP_ID as string,
	saltStoreCode: process.env.HASH_SALT_STORE_CODE as string,
	keyVersionLineId: process.env.KEY_VERSION_HMAC_LINE_ID as string,
	keyVersionGroupId: process.env.KEY_VERSION_HMAC_GROUP_ID as string,
	keyVersionStoreCode: process.env.KEY_VERSION_HMAC_STORE_CODE as string,
};

/// STRIPE
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
export const STRIPE_WEBHOOK_SECRET = process.env
	.STRIPE_WEBHOOK_SECRET as string;

/// ルーティング
export const liffUrl = {
	registerOwnerPage: process.env.LIFF_URL_REGISTER_OWNER as string,
	connectLineGroupPage: process.env.LIFF_URL_REGISTER_CONNECT as string,
	dashboardPage: process.env.LIFF_URL_DASHBOARD as string,
	createRequestPage: process.env.LIFF_URL_CREATE_REQUEST as string,
	submitRequestPage: process.env.LIFF_URL_SUBMIT_REQUEST as string,
	generateShiftPage: process.env.LIFF_URL_GENERATE_SHIFT as string,
	adjustShiftPage: process.env.LIFF_URL_ADJUST_SHIFT as string,
	showConfirmShiftPage: process.env.LIFF_URL_SHOW_CONFIRMED_SHIFT as string,
};
export const URI_REGISTER_OWNER = process.env.URI_REGISTER_OWNER as string;
export const URI_CONNECT_LINE_GROUP = process.env
	.URI_CONNECT_LINE_GROUP as string;
export const URI_REGISTER_STAFF = process.env.URI_REGISTER_STAFF as string;
export const URI_SHIFT_SUBMITTED = process.env.URI_SHIFT_SUBMITTED as string;
export const URI_SHIFT_CONFIRMATION = process.env
	.URI_SHIFT_CONFIRMATION as string;

export const STRIPE_TRIAL_DAYS = process.env.STRIPE_TRIAL_DAYS as string;

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
export const URI_DASHBOARD = process.env.URI_DASHBOARD as string;
