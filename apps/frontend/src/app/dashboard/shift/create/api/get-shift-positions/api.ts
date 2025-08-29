import { API_URL } from "@/lib/env";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetShfitPositionsResponse } from "@shared/api/shiftPosition/types/get-by-store-id";

export const getShiftPositions = async (
	jwt: string,
): Promise<GetShfitPositionsResponse | ErrorResponse> => {
	if (!jwt) {
		throw new Error("JWT is not found");
	}
	const res = await fetch(`${API_URL}/api/shift-position/all`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await res.json();

	return data;
};
