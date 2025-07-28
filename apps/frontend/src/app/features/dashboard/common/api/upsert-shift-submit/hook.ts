import type { UpsertSubmittedShiftFormType } from "@shared/api/shift/submit/validations/put";
import { useState } from "react";
import { upsertSubmitShift } from "./api";

export const useUpsertSubmitShift = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleUpsertSubmitShift = async ({
		userToken,
		storeToken,
		formData,
	}: {
		userToken: string;
		storeToken: string;
		formData: UpsertSubmittedShiftFormType;
	}) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await upsertSubmitShift({ userToken, storeToken, formData });
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

			return res.submittedShift;
			// dispatch(saveShiftRequest(res.shiftRequest));
		} catch (err) {
			setError("通信エラーが発生しました。");
			console.warn("エラー:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return { handleUpsertSubmitShift, isLoading, error };
};
