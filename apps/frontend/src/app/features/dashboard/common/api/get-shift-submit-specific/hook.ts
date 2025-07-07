import type { RootState } from "@/app/redux/store";
import type { GetSubmittedShiftsSpecificResponse } from "@shared/api/shift/submit/types/get-by-shift-request-id"; // 任意
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { getSubmittedShiftsSpecific } from "./api";

export const useGetSubmittedShiftsSpecific = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { userToken, storeToken } = useSelector(
		(state: RootState) => state.token,
	);

	const handleGetSubmitShiftsSpecific = useCallback(
		async (
			shiftRequestId: string,
		): Promise<GetSubmittedShiftsSpecificResponse | undefined> => {
			if (!userToken || !storeToken || !shiftRequestId) {
				setError("必要な情報が不足しています");
				console.warn("Missing tokens or shiftRequestId");
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const res = await getSubmittedShiftsSpecific({
					userToken,
					storeToken,
					shiftRequestId,
				});

				if (!res.ok) {
					setError("通信エラーが発生しました");
					console.warn("Error:", res.message);
					return;
				}

				return res;
			} catch (err) {
				setError("通信エラーが発生しました。");
				console.error("Fetch failed:", err);
				window.alert("通信エラーが発生しました");
			} finally {
				setIsLoading(false);
			}
		},
		[userToken, storeToken],
	);

	return { handleGetSubmitShiftsSpecific, isLoading, error };
};
