// import type { RootState } from "@/app/redux/store";
// import type { GetAssigShiftResponse } from "@shared/api/shift/assign/types/get-by-shift-request-id";
// import { useCallback, useState } from "react";
// import { useSelector } from "react-redux";
// import { getAssignShift } from "./api";

// export const useGetAssignShift = () => {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);
// 	const { userToken, storeToken } = useSelector(
// 		(state: RootState) => state.token,
// 	);

// 	const handleGetAssignShift = useCallback(
// 		async ({
// 			shiftRequestId,
// 		}: {
// 			shiftRequestId: string;
// 		}): Promise<GetAssigShiftResponse | undefined> => {
// 			setIsLoading(true);
// 			setError(null);
// 			try {
// 				if (!userToken) throw new Error("code is not found");
// 				if (!storeToken) throw new Error("code is not found");
// 				if (!shiftRequestId) throw new Error("shiftRequestId is not found");

// 				const res = await getAssignShift({
// 					userToken,
// 					storeToken,
// 					shiftRequestId,
// 				});
// 				if (!res.ok) {
// 					if ("errors" in res) {
// 						setError("通信エラーが発生しました");
// 						console.warn(res.message, res.errors);
// 						return;
// 					}
// 					setError("通信エラーが発生しました");
// 					console.warn("エラー:", res.message);
// 					return;
// 				}
// 				return res;
// 			} catch (err) {
// 				setError("通信エラーが発生しました。");
// 				window.alert("通信エラーが発生しました");
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		},
// 		[userToken, storeToken],
// 	);

// 	return { handleGetAssignShift, isLoading, error };
// };
