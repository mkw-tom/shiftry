import type { RootState } from "@/redux/store";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import { SubmittedShiftWithJson } from "@shared/api/common/types/merged";
import type { GetSubmittedShiftMeResponse } from "@shared/api/shift/submit/types/get-me";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { getSubmittedShiftMe } from "../api/getSubmitShiftMe";

export const useGetSubmittedShiftUser = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const fetchGetSubmitShiftMe = useCallback(async (): Promise<
		GetSubmittedShiftMeResponse | ErrorResponse
	> => {
		setIsLoading(true);
		setError(null);

		try {
			if (!jwt) {
				setError("JWTトークンが見つかりません");
				throw new Error("JWTトークンが見つかりません");
			}

			const res = await getSubmittedShiftMe(jwt);
			if (!res.ok) {
				return { ok: false, message: res.message };
			}

			return res;
		} catch (err) {
			setError("通信エラーが発生しました");
			const errorMessage =
				err instanceof Error ? err.message : "不明なエラーが発生しました";
			return { ok: false, message: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, [jwt]);

	return { fetchGetSubmitShiftMe, isLoading, error };
};
