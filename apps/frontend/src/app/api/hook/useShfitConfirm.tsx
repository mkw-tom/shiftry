import type { RootState } from "@/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { UpsertAssignShfitInput } from "@shared/api/shift/assign/validations/put";
import type { ShiftConfirmResponse } from "@shared/api/shift/confirm/type";
import type { UpsertShiftRequetInput } from "@shared/api/shift/request/validations/put";
import type { LineMessageAPIResponse } from "@shared/api/webhook/line/types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { shiftNotificationApi } from "../path";
import { useFetch } from "../useFetch";

export const useShiftConfirm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const shiftConfirm = async ({
		upsertShiftReqeustData,
		upsertAssignShiftData,
	}: {
		upsertShiftReqeustData: UpsertShiftRequetInput;
		upsertAssignShiftData: UpsertAssignShfitInput;
	}): Promise<
		ShiftConfirmResponse | ErrorResponse | ValidationErrorResponse
	> => {
		setIsLoading(true);
		setError(null);
		try {
			if (!jwt) {
				setError("トークンが見つかりません。");
				return { ok: false, message: "トークンが見つかりません。" };
			}
			if (!upsertShiftReqeustData || !upsertAssignShiftData) {
				setError("シフトデータが見つかりません。");
				return { ok: false, message: "シフトデータが見つかりません。" };
			}
			const res = await useFetch<ShiftConfirmResponse>({
				jwt,
				method: "POST",
				path: shiftNotificationApi.confirm,
				body: {
					upsertShiftReqeustData,
					upsertAssignShiftData,
				},
			});

			return res;
		} catch (err) {
			setError("通信エラーが発生しました。");
			return { ok: false, message: "通信エラーが発生しました。" };
		} finally {
			setIsLoading(false);
		}
	};

	return { shiftConfirm, isLoading, error };
};
