import type { RootState } from "@/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { AIShiftAdjustResponse } from "@shared/api/shift/ai/types/post-adjust";
import type { AIShiftAdjustRequest } from "@shared/api/shift/ai/validations/post-adjust";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { aiApi } from "../path";
import { useFetch } from "../useFetch";

export const useAiAdjust = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const aiAdjust = useCallback(
		async (
			body: AIShiftAdjustRequest,
		): Promise<
			AIShiftAdjustResponse | ErrorResponse | ValidationErrorResponse
		> => {
			setIsLoading(true);
			setError(null);
			try {
				if (!jwt) {
					setError("認証トークンが不足しています");
					throw new Error("認証トークンが不足しています");
				}

				const res = await useFetch<AIShiftAdjustResponse>({
					jwt,
					method: "POST",
					path: aiApi.adjust,
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

	return { aiAdjust, isLoading, error };
};
