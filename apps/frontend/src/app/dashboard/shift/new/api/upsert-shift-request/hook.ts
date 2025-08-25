import { saveActiveShiftRequest } from "@/app/redux/slices/activeShiftRequests";
import type { AppDispatch, RootState } from "@/app/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { UpsertShiftRequetResponse } from "@shared/api/shift/request/types/put";
import type { UpsertShiftRequetType } from "@shared/api/shift/request/validations/put";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { upsertShiftRequest } from "./api";

export const useUpsertShiftReqeust = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { jwt } = useSelector((state: RootState) => state.authToken);
	const handleUpsertShiftRequest = async (
		formData: UpsertShiftRequetType,
	): Promise<
		UpsertShiftRequetResponse | ErrorResponse | ValidationErrorResponse
	> => {
		setIsLoading(true);
		setError(null);
		try {
			if (!jwt) {
				setError("JWTが見つかりません");
				throw new Error("JWTが見つかりません");
			}

			const res = await upsertShiftRequest(jwt, formData);
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
	};

	return { handleUpsertShiftRequest, isLoading, error };
};
