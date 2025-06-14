import type { GetAssigShiftResponse } from "@shared/shift/assign/types/get-by-shift-request-id";
import { useCallback, useState } from "react";
import { getAssignShift } from "./api";

export const useGetAssignShift = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGetAssignShift = useCallback(
		async ({
			userToken,
			storeToken,
			shiftRequestId,
		}: {
			userToken: string;
			storeToken: string;
			shiftRequestId: string;
		}): Promise<GetAssigShiftResponse | undefined> => {
			setIsLoading(true);
			setError(null);
			try {
				const res = await getAssignShift({
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

	return { handleGetAssignShift, isLoading, error };
};
