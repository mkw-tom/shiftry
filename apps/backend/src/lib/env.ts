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

/// LINE-AUTH
export const LINE_AUTH_CHANNEL_ID = process.env.LINE_AUTH_CHANNEL_ID as string;
export const LINE_AUTH_CHANNEL_SECRET = process.env
	.LINE_AUTH_CHANNEL_SECRET as string;
export const LINE_AUTH_REDIRECT_URI = process.env
	.LINE_AUTH_REDIRECT_URI as string;

/// JWT
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;

/// STRIPE
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
export const STRIPE_WEBHOOK_SECRET = process.env
	.STRIPE_WEBHOOK_SECRET as string;

/// ルーティング
export const URI_REGISTER_OWNER = process.env.URI_REGISTER_OWNER as string;
export const URI_CONNECT_LINE_GROUP = process.env
	.URI_CONNECT_LINE_GROUP as string;
export const URI_REGISTER_STAFF = process.env.URI_REGISTER_STAFF as string;
export const URI_SHIFT_SUBMITTED = process.env.URI_SHIFT_SUBMITTED as string;
export const URI_SHIFT_CONFIRMATIOIN = process.env
	.URI_SHIFT_CONFIRMATIOIN as string;

export const STRIPE_TRIAL_DAYS = process.env.STRIPE_TRIAL_DAYS as string;

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
