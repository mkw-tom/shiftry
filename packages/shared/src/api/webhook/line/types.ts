export interface MessageContens {
	text1: string;
	text2?: string;
	text3?: string;
	label: string;
	uri: string;
}

export interface LineMessageAPIResponse {
	ok: true;
	message: string;
}
