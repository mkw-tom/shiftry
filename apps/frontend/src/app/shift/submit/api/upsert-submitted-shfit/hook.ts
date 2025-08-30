import type { RootState } from "@/redux/store";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { UpsertSubmittedShfitResponse } from "@shared/api/shift/submit/types/put";
import type { UpsertSubmittedShiftInput } from "@shared/api/shift/submit/validations/put";
import { useState } from "react";
import { useSelector } from "react-redux";
import { upsertSubmitShift } from "./api";

export const useUpsertSubmitShift = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const handleUpsertSubmitShift = async ({
		formData,
	}: {
		formData: UpsertSubmittedShiftInput;
	}): Promise<UpsertSubmittedShfitResponse | ErrorResponse> => {
		setIsLoading(true);
		setError(null);
		try {
			if (!jwt) {
				return { ok: false, message: "ユーザー認証に失敗しました" };
			}
			if (!formData) {
				return { ok: false, message: "フォームデータが不正です" };
			}

			const res = await upsertSubmitShift({ jwt, formData });
			if (!res.ok) {
				setError("通信エラーが発生しました");
				return { ok: false, message: res.message };
			}

			return res;
		} catch (err) {
			setError("通信エラーが発生しました。");
			console.warn("エラー:", error);
			return { ok: false, message: "通信エラーが発生しました" };
		} finally {
			setIsLoading(false);
		}
	};

	return { handleUpsertSubmitShift, isLoading, error };
};
