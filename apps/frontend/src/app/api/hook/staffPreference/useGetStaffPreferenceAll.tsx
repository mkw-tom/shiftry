import type { RootState } from "@/redux/store";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetStaffPreferenceAllResponse } from "@shared/api/staffPreference/types/get_all";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { staffPreferenceApi } from "../../path";
import { useFetch } from "../../useFetch";

export const useGetStaffPreferenceAll = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const getStaffPreferenceAll = useCallback(async (): Promise<
		GetStaffPreferenceAllResponse | ErrorResponse
	> => {
		setIsLoading(true);
		setError(null);
		try {
			if (!jwt) {
				setError("認証トークンが不足しています");
				throw new Error("認証トークンが不足しています");
			}

			const res = await useFetch<GetStaffPreferenceAllResponse>({
				jwt,
				method: "GET",
				path: staffPreferenceApi.getAll,
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

	return { getStaffPreferenceAll, isLoading, error };
};
