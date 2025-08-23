// import type { RootState } from "@/app/redux/store";
// import type { RequestShiftMessageType } from "@shared/api/webhook/line/validatioins";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { sendShiftRequest } from "./api";

// export const useSendShiftReqeust = () => {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);
// 	const { userToken, storeToken, groupToken } = useSelector(
// 		(state: RootState) => state.token,
// 	);

// 	const handleSendShiftRequest = async ({
// 		sendData,
// 	}: {
// 		sendData: RequestShiftMessageType;
// 	}) => {
// 		setIsLoading(true);
// 		setError(null);
// 		try {
// 			if (!userToken || !storeToken || !groupToken) {
// 				setError("トークンが見つかりません。");
// 				return;
// 			}
// 			const res = await sendShiftRequest({
// 				userToken,
// 				storeToken,
// 				groupToken,
// 				sendData,
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
// 			alert("lineグループに休み希望提出を通知しました");
// 		} catch (err) {
// 			setError("通信エラーが発生しました。");
// 			console.warn("エラー:", error);
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	return { handleSendShiftRequest, isLoading, error };
// };
