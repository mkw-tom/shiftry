import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { PutBulkJobRoleType } from "@shared/api/jobRole/Validations/put-bulk";
import type { BulkUpsertJobRoleResponse } from "@shared/api/jobRole/types/put-bulk";
import type { UpsertShiftRequetResponse } from "@shared/api/shift/request/types/put";
import type { UpsertShiftRequetType } from "@shared/api/shift/request/validations/put";

export const putBulkUpsertJobroles = async (
	jwt: string,
	formData: PutBulkJobRoleType,
): Promise<
	BulkUpsertJobRoleResponse | ErrorResponse | ValidationErrorResponse
> => {
	if (!jwt) {
		throw new Error("JWT is not found");
	}
	const res = await fetch(`${API_URL}/api/jobrole/bulk`, {
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
