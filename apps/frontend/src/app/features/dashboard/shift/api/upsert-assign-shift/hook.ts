// import type { RootState } from "@/app/redux/store";
// import type { GetAssigShiftResponse } from "@shared/api/shift/assign/types/get-by-shift-request-id";
// import type { upsertAssignShfitInputType } from "@shared/api/shift/assign/validations/put";
// import { useCallback, useState } from "react";
// import { useSelector } from "react-redux";
// import { upsertAssignShift } from "./api";

// export const useGetAssignShift = () => {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);
// 	const { userToken, storeToken } = useSelector(
// 		(state: RootState) => state.token,
// 	);

// 	const handleUpsertAssignShift = useCallback(
// 		async ({
// 			upsertAssingShfitData,
// 		}: {
// 			upsertAssingShfitData: upsertAssignShfitInputType;
// 		}): Promise<GetAssigShiftResponse | undefined> => {
// 			setIsLoading(true);
// 			setError(null);
// 			try {
// 				if (!userToken) throw new Error("code is not found");
// 				if (!storeToken) throw new Error("code is not found");
// 				if (!upsertAssingShfitData)
// 					throw new Error("shiftRequestId is not found");

// 				const res = await upsertAssignShift({
// 					userToken,
// 					storeToken,
// 					upsertAssingShfitData,
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

// 	return { handleUpsertAssignShift, isLoading, error };
// };
