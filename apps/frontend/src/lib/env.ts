/// API-URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

/// LINE-AUTH
export const NEXT_PUBLIC_LINE_AUTH_CHANNEL_ID = process.env
	.NEXT_PUBLIC_LINE_AUTH_CHANNEL_ID as string;
export const NEXT_PUBLIC_LINE_AUTH_REDIRECT_URI = process.env
	.NEXT_PUBLIC_LINE_AUTH_REDIRECT_URI as string;

/// LIFF
export const NEXT_PUBLIC_LIFF_ID_CONNECT_GROUP = process.env
	.NEXT_PUBLIC_LIFF_ID_CONNECT_GROUP as string;
export const NEXT_PUBLIC_LIFF_ID_REGISTER_STAFF = process.env
	.NEXT_PUBLIC_LIFF_ID_REGISTER_STAFF as string;

export const NEXT_PUBLIC_STRIPE_PK = process.env
	.NEXT_PUBLIC_STRIPE_PK as string;

export const PLAN_MAX12 = process.env.NEXT_PUBLIC_PLAN_MAX12 as string;

export const PLAN_MAX30 = process.env.NEXT_PUBLIC_PLAN_MAX30 as string;

export const liffId = {
	registerOwner: process.env.NEXT_PUBLIC_LIFF_ID_REGISTER_OWNER as string,
	registerConnect: process.env.NEXT_PUBLIC_LIFF_ID_REGISTER_CONNECT as string,
	registerStaff: process.env.NEXT_PUBLIC_LIFF_ID_REGISTER_STAFF as string,
	dashboard: process.env.NEXT_PUBLIC_LIFF_ID_DASHBOARD as string,
	shiftSubmit: process.env.NEXT_PUBLIC_LIFF_ID_SHIFT_SUBMIT as string,
	createRequest: process.env.NEXT_PUBLIC_LIFF_ID_CREAETE_REQUEST as string,
	generateShift: process.env.NEXT_PUBLIC_LIFF_ID_GENERATE_SHIFT as string,
	adjustShift: process.env.NEXT_PUBLIC_LIFF_ID_ADJUST_SHIFT as string,
	showConfirmedShift: process.env
		.NEXT_PUBLIC_LIFF_ID_SHOW_CONFIRMED_SHIFT as string,
};

export const liffUrl = {
	createRequestPage: process.env.NEXT_PUBLIC_LIFF_URL_CREATE_REQUEST,
	shiftSubmitPage: process.env.NEXT_PUBLIC_LIFF_URL_SHIFT_SUBMIT,
};
