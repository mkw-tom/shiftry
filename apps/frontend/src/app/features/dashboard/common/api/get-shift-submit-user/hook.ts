import type { RootState } from "@/app/redux/store";
import { SubmittedShiftWithJson } from "@shared/api/common/types/merged";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { getSubmittedShiftUser } from "./api";

export const useGetSubmittedShiftUser = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { userToken, storeToken } = useSelector(
		(state: RootState) => state.token,
	);

	const handleGetSubmitShiftUser = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		if (!userToken || !storeToken) {
			setError("ユーザートークンまたはストアトークンが見つかりません");
			return;
		}
		try {
			const res = await getSubmittedShiftUser({
				userToken,
				storeToken,
			});

			if (!res.ok) {
				if ("errors" in res) {
					setError("通信エラーが発生しました");
					console.warn(res.message, res.errors);
					return;
				}
				setError("通信エラーが発生しました");
				console.warn("エラー:", res.message);
				return;
			}

			return res;
		} catch (err) {
			setError("通信エラーが発生しました。");
			window.alert("通信エラーが発生しました");
		} finally {
			setIsLoading(false);
		}
	}, [userToken, storeToken]);

	return { handleGetSubmitShiftUser, isLoading, error };
};
