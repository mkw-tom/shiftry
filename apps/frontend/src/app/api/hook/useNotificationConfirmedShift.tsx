// import type { RootState } from "@/redux/store";
// import type {
// 	ErrorResponse,
// 	ValidationErrorResponse,
// } from "@shared/api/common/types/errors";
// import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types";
// import type { ConfirmShiftMessageType, RequestShiftMessageType } from "@shared/api/webhook/line/validatioins";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { useFetch } from "../useFetch";
// import { lineMessageApi } from "../path";

// export const useNotificationConfirmedShift = () => {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);
// 	const { jwt } = useSelector((state: RootState) => state.authToken);

// 	const notificationConfirmedShift = async ({
// 		sendData,
// 	}: {
// 		sendData: ConfirmShiftMessageType;
// 	}): Promise<
// 		LineMessageAPIResponse | ErrorResponse | ValidationErrorResponse
// 	> => {
// 		setIsLoading(true);
// 		setError(null);
// 		try {
// 			if (!jwt) {
// 				setError("トークンが見つかりません。");
// 				return { ok: false, message: "トークンが見つかりません。" };
// 			}
//       const res = await useFetch<LineMessageAPIResponse>({
//         jwt,
//         method: "POST",
//         path: lineMessageApi.confirmedShift,
//         body: sendData,
//       })
// 			return res;
// 		} catch (err) {
// 			setError("通信エラーが発生しました。");
// 			return { ok: false, message: "通信エラーが発生しました。" };
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	return { notificationConfirmedShift, isLoading, error };
// };
