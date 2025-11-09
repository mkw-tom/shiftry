import type { RootState } from "@/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { AutoShiftAdjustResponse } from "@shared/api/shift/adjust/types/auto";
import type { AutoShiftAdjustRequest } from "@shared/api/shift/adjust/validations/auto";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { shiftAdjust } from "../path";
import { useFetch } from "../useFetch";

export const useAutoAdjust = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const autoAdjust = useCallback(
		async (
			body: AutoShiftAdjustRequest,
		): Promise<
			AutoShiftAdjustResponse | ErrorResponse | ValidationErrorResponse
		> => {
			setIsLoading(true);
			setError(null);
			try {
				if (!jwt) {
					setError("認証トークンが不足しています");
					throw new Error("認証トークンが不足しています");
				}

				const res = await useFetch<AutoShiftAdjustResponse>({
					jwt,
					method: "POST",
					path: shiftAdjust.auto,
					body,
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

	return { autoAdjust, isLoading, error };
};
