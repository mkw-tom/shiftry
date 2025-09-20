import { saveActiveShiftRequest } from "@/redux/slices/activeShiftRequests";
import type { AppDispatch, RootState } from "@/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { UpsertShiftRequetResponse } from "@shared/api/shift/request/types/put";
import type { UpsertShiftRequetInput } from "@shared/api/shift/request/validations/put";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignShiftApi } from "../path";
import { useFetch } from "../useFetch";

export const useUpsertShiftReqeust = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { jwt } = useSelector((state: RootState) => state.authToken);
	const handleUpsertShiftRequest = useCallback(
		async (
			formData: UpsertShiftRequetInput,
			shiftRequestId: string,
		): Promise<
			UpsertShiftRequetResponse | ErrorResponse | ValidationErrorResponse
		> => {
			setIsLoading(true);
			setError(null);
			try {
				if (!jwt) {
					setError("認証トークンが不足しています");
					throw new Error("認証トークンが不足しています");
				}

				const res = await useFetch<UpsertShiftRequetResponse>({
					jwt,
					method: "PUT",
					path: assignShiftApi.index(shiftRequestId),
					body: formData,
				});

				if (!res.ok) {
					if ("errors" in res) {
						setError("入力に誤りがあります");
						return {
							ok: false,
							message: `ErrorMessage：${res.message}, validationError: ${res.errors}`,
						};
					}

					setError("通信エラーが発生しました");
					return res;
				}

				dispatch(saveActiveShiftRequest(res.shiftRequest));
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
		[jwt, dispatch],
	);

	return { handleUpsertShiftRequest, isLoading, error };
};
