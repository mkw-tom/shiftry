import { useState } from "react";
import { sendShiftRequest } from "./api";

export const useSendShiftReqeust = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSendShiftRequest = async ({
		userToken,
		storeToken,
		groupToken,
	}: {
		userToken: string;
		storeToken: string;
		groupToken: string;
	}) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await sendShiftRequest({ userToken, storeToken, groupToken });
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
			alert("lineグループに休み希望提出を通知しました");
		} catch (err) {
			setError("通信エラーが発生しました。");
			console.warn("エラー:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return { handleSendShiftRequest, isLoading, error };
};
