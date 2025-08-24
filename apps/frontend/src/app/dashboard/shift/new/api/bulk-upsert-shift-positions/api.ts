import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { BulkUpsertShiftPositionsResponse } from "@shared/api/shiftPosition/types/put-bulk";
import type { bulkUpsertShiftPositionType } from "@shared/api/shiftPosition/validations/put-bulk";

export const putBulkUpsertShiftPositions = async (
	jwt: string,
	formData: bulkUpsertShiftPositionType,
): Promise<
	BulkUpsertShiftPositionsResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!jwt) {
		throw new Error("JWT is not found");
	}
	const res = await fetch(`${API_URL}/api/shift-position/bulk`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
		body: JSON.stringify(formData),
	});

	const data = await res.json();

	return data;
};
