export interface LineAuthServiceResponse {
	userId: string;
	name: string;
	pictureUrl: string;
}

export interface LineAuthResponse {
	ok: true;
	userId: string;
	name: string;
	pictureUrl: string;
	line_token: string;
}
