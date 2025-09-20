import type { AppDispatch, RootState } from "@/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";

import type { UpsertAssigShiftResponse } from "@shared/api/shift/assign/types/put";
import type { UpsertAssignShfitInput } from "@shared/api/shift/assign/validations/put";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignShiftApi } from "../path";
import { useFetch } from "../useFetch";

export const useUpsertAssignShift = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { jwt } = useSelector((state: RootState) => state.authToken);
	const searchParams = useSearchParams();

	const upsertAssignShift = useCallback(
		async ({
			upsertData,
			shiftRequestId,
		}: {
			upsertData: UpsertAssignShfitInput;
			shiftRequestId: string;
		}): Promise<
			UpsertAssigShiftResponse | ErrorResponse | ValidationErrorResponse
		> => {
			setIsLoading(true);
			setError(null);
			try {
				if (!jwt) {
					setError("認証トークンが不足しています");
					throw new Error("認証トークンが不足しています");
				}

				const res = await useFetch<UpsertAssigShiftResponse>({
					jwt,
					method: "PUT",
					path: assignShiftApi.index(),
					body: upsertData,
				});

				if (!res.ok) {
					setError("通信エラーが発生しました");
					return res;
				}

				return res;
			} catch (err) {
				setError("通信エラーが発生しました。");
				return {
					ok: false,
					message: err instanceof Error ? err.message : "Unknown error",
				};
			} finally {
				setIsLoading(false);
			}
		},
		[jwt],
	);

	return { upsertAssignShift, isLoading, error };
};
