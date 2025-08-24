import { saveActiveShiftRequest } from "@/app/redux/slices/activeShiftRequests";
import type { AppDispatch, RootState } from "@/app/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import {
	PutBulkJobRoleType,
	putBulkJobRoleValidate,
} from "@shared/api/jobRole/Validations/put-bulk";
import type { UpsertShiftRequetResponse } from "@shared/api/shift/request/types/put";
import type { UpsertShiftRequetType } from "@shared/api/shift/request/validations/put";
import type { BulkUpsertShiftPositionsResponse } from "@shared/api/shiftPosition/types/put-bulk";
import type { bulkUpsertShiftPositionType } from "@shared/api/shiftPosition/validations/put-bulk";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { putBulkUpsertShiftPositions } from "./api";

export const useBulkUpsertShiftPositions = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const handleBulkUpsertShiftPositions = async (
		formData: bulkUpsertShiftPositionType,
	): Promise<
		BulkUpsertShiftPositionsResponse | ErrorResponse | ValidationErrorResponse
	> => {
		setIsLoading(true);
		setError(null);
		try {
			if (!jwt) {
				setError("JWTが見つかりません");
				throw new Error("JWTが見つかりません");
			}

			const res = await putBulkUpsertShiftPositions(jwt, formData);
			if (!res.ok) {
				if ("errors" in res) {
					setError("入力に誤りがあります");
					return res;
				}
				setError("通信エラーが発生しました");
				return res;
			}

			return res;
		} catch (err) {
			setError("通信エラーが発生しました。");
			return {
				ok: false,
				message: err instanceof Error ? err.message : "Unknown error",
			};
		} finally {
			setIsLoading(false);
		}
	};

	return { handleBulkUpsertShiftPositions, isLoading, error };
};
