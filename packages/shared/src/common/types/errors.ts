import type { ZodIssue } from "zod";

export interface ErrorResponse {
	ok: false;
	message: string;
}

export interface ValidationErrorResponse {
	ok: false;
	message: string;
	errors: ZodIssue[];
}
