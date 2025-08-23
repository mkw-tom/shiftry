// import type { RootState } from "@/app/redux/store";
// import type { CreateShiftValidateType } from "@shared/api/shift/ai/validations/post-create";
// import { useCallback, useState } from "react";
// import { useSelector } from "react-redux";
// import { generateShiftWithAI } from "./api";

// export const useGenerateShiftWithAI = () => {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);
// 	const { userToken, storeToken } = useSelector(
// 		(state: RootState) => state.token,
// 	);

// 	const handleGenerateShiftWithAI = async ({
// 		formData,
// 	}: {
// 		formData: CreateShiftValidateType | null;
// 	}) => {
// 		setIsLoading(true);
// 		setError(null);
// 		if (!userToken || !storeToken) {
// 			throw new Error("トークン情報が存在しません");
// 		}
// 		if (!formData) {
// 			throw new Error("送信するデータが存在しません");
// 		}
// 		try {
// 			const res = await generateShiftWithAI({
// 				userToken,
// 				storeToken,
// 				formData,
// 			});
// 			if (!res.ok) {
// 				if ("errors" in res) {
// 					setError("通信エラーが発生しました");
// 					console.warn(res.message, res.errors);
// 					return;
// 				}
// 				setError("通信エラーが発生しました");
// 				console.warn("エラー:", res.message);
// 				return;
// 			}
// 			return res;
// 		} catch (err) {
// 			setError("通信エラーが発生しました。");
// 			window.alert("通信エラーが発生しました");
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	return { handleGenerateShiftWithAI, isLoading, error };
// };
