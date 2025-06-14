import { saveShiftRequest } from "@/app/redux/slices/shiftRequests";
import type { AppDispatch } from "@/app/redux/store";
import type { UpsertShiftRequetType } from "@shared/shift/request/validations/put";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { upsertShiftRequest } from "./api";

export const useUpsertShiftReqeust = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useDispatch<AppDispatch>();

	const handleUpsertShiftRequest = async ({
		userToken,
		storeToken,
		formData,
	}: {
		userToken: string;
		storeToken: string;
		formData: UpsertShiftRequetType;
	}) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await upsertShiftRequest({ userToken, storeToken, formData });
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

			dispatch(saveShiftRequest(res.shiftRequest));
		} catch (err) {
			setError("通信エラーが発生しました。");
			console.warn("エラー:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return { handleUpsertShiftRequest, isLoading, error };
};
