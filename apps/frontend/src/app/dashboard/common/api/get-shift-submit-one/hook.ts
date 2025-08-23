import { useCallback, useState } from "react";
import { getSubmittedShiftUserOne } from "./api";

export const useGetSubmittedShiftUserOne = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGetSubmitShiftUserOne = useCallback(
		async ({
			userToken,
			storeToken,
			shiftRequestId,
		}: {
			userToken: string;
			storeToken: string;
			shiftRequestId: string;
		}) => {
			setIsLoading(true);
			setError(null);
			try {
				const res = await getSubmittedShiftUserOne({
					userToken,
					storeToken,
					shiftRequestId,
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
		},
		[],
	);

	return { handleGetSubmitShiftUserOne, isLoading, error };
};
