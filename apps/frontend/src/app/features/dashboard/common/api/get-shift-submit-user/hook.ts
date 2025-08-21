// import type { RootState } from "@/app/redux/store";
// import { SubmittedShiftWithJson } from "@shared/api/common/types/merged";
// import { useCallback, useState } from "react";
// import { useSelector } from "react-redux";
// import { getSubmittedShiftUser } from "./api";

// export const useGetSubmittedShiftUser = () => {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);

// 	const handleGetSubmitShiftUser = useCallback(
// 		async ({
// 			userToken,
// 			storeToken,
// 		}: {
// 			userToken: string;
// 			storeToken: string;
// 		}) => {
// 			setIsLoading(true);
// 			setError(null);

// 			try {
// 				if (!userToken || !storeToken) {
// 					throw new Error(
// 						"ユーザートークンまたはストアトークンが見つかりません",
// 					);
// 				}

// 				const res = await getSubmittedShiftUser({ userToken, storeToken });

// 				if (!res.ok) {
// 					const message = res.message ?? "通信エラーが発生しました";
// 					throw new Error(message);
// 				}

// 				return res;
// 			} catch (err) {
// 				setError("通信エラーが発生しました");
// 				return null;
// 			} finally {
// 				setIsLoading(false); // どんな場合でもここでOFFになる
// 			}
// 		},
// 		[],
// 	);

// 	return { handleGetSubmitShiftUser, isLoading, error, setError };
// };
