import type { RootState } from "@/redux/store";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import { SubmittedShiftWithJson } from "@shared/api/common/types/merged";
import type { GetArchiveShiftRequestsResponse } from "@shared/api/shift/request/types/get-archive";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { getArchiveShiftRequests } from "./api";

export const useGetArchiveShiftRequests = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const handleGetArchiveShiftRequests = useCallback(async (): Promise<
		GetArchiveShiftRequestsResponse | ErrorResponse
	> => {
		setIsLoading(true);
		setError(null);

		try {
			if (!jwt) {
				setError("JWTが見つかりません");
				throw new Error("JWTが見つかりません");
			}

			const res = await getArchiveShiftRequests(jwt);
			if (!res.ok) {
				setError(res.message);
				return res;
			}

			return res;
		} catch (err) {
			setError("通信エラーが発生しました");
			const message = err instanceof Error ? err.message : "不明なエラー";
			return { ok: false, message };
		} finally {
			setIsLoading(false); // どんな場合でもここでOFFになる
		}
	}, [jwt]);

	return { handleGetArchiveShiftRequests, isLoading, error, setError };
};
