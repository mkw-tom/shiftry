import type { RootState } from "@/app/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types";
import type { RequestShiftMessageType } from "@shared/api/webhook/line/validatioins";
import { useState } from "react";
import { useSelector } from "react-redux";
import { sendShiftRequest } from "./api";

export const useSendShiftReqeust = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const handleSendShiftRequest = async ({
		sendData,
	}: {
		sendData: RequestShiftMessageType;
	}): Promise<
		LineMessageAPIResponse | ErrorResponse | ValidationErrorResponse
	> => {
		setIsLoading(true);
		setError(null);
		try {
			if (!jwt) {
				setError("トークンが見つかりません。");
				return { ok: false, message: "トークンが見つかりません。" };
			}
			const res = await sendShiftRequest({
				jwt,
				sendData,
			});
			if (!res.ok) {
				if ("errors" in res) {
					setError("入力に誤りがあります。");
					return res;
				}
				setError(res.message || "送信に失敗しました。");
				return res;
			}

			return res;
		} catch (err) {
			setError("通信エラーが発生しました。");
			return { ok: false, message: "通信エラーが発生しました。" };
		} finally {
			setIsLoading(false);
		}
	};

	return { handleSendShiftRequest, isLoading, error };
};
