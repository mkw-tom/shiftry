import type { RootState } from "@/redux/store";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetSubmittedShiftMeResponse } from "@shared/api/shift/submit/types/get-me";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { submittedShiftApi } from "../../path";
import { useFetch } from "../../useFetch";

export const useGetSubmittedShfitsMe = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const getSubmittedShfitsMe = useCallback(async (): Promise<
		GetSubmittedShiftMeResponse | ErrorResponse
	> => {
		setIsLoading(true);
		setError(null);
		try {
			if (!jwt) {
				setError("認証トークンが不足しています");
				throw new Error("認証トークンが不足しています");
			}

			const res = await useFetch<GetSubmittedShiftMeResponse>({
				jwt,
				method: "GET",
				path: submittedShiftApi.me,
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
	}, [jwt]);

	return { getSubmittedShfitsMe, isLoading, error };
};
