import { API_URL } from "@/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";

export const useFetch = async <R = unknown, T = unknown>({
	jwt,
	method,
	path,
	body,
}: {
	jwt: string;
	method: "GET" | "POST" | "PUT" | "DELETE";
	path: string;
	body?: T;
}): Promise<
	T extends undefined
		? R | ErrorResponse
		: R | ErrorResponse | ValidationErrorResponse
> => {
	const url = `${API_URL}/api/${path}`;

	const res = await fetch(url, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	const data = await res.json();

	return data;
};
