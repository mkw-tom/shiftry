import { API_URL } from "@/app/lib/env";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { UpsertAssigShiftResponse } from "@shared/api/shift/assign/types/put";
import type { upsertAssignShfitInputType } from "@shared/api/shift/assign/validations/put";

export const upsertAssignShift = async ({
	userToken,
	storeToken,
	upsertAssingShfitData,
}: {
	userToken: string;
	storeToken: string;
	upsertAssingShfitData: upsertAssignShfitInputType;
}): Promise<
	UpsertAssigShiftResponse | ErrorResponse | ValidationErrorResponse
> => {
	const { shiftRequestId } = upsertAssingShfitData;
	const res = await fetch(`${API_URL}/api/shift/assign/${shiftRequestId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userToken}`,
			"x-store-id": storeToken,
		},
		body: JSON.stringify(upsertAssingShfitData),
	});

	const data = await res.json();

	return data;
};
