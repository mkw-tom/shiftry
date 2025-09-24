import { saveActiveShiftRequest } from "@/redux/slices/activeShiftRequests";
import type { AppDispatch, RootState } from "@/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import {
	type PutBulkJobRoleType,
	putBulkJobRoleValidate,
} from "@shared/api/jobRole/Validations/put-bulk";
import type { BulkUpsertJobRoleResponse } from "@shared/api/jobRole/types/put-bulk";
import type { UpsertShiftRequetResponse } from "@shared/api/shift/request/types/put";
import type { UpsertShiftRequetType } from "@shared/api/shift/request/validations/put";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { putBulkUpsertJobroles } from "./api";

export const useBulkUpsertJobroles = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { jwt } = useSelector((state: RootState) => state.authToken);
	const handleBulkUpsertJobroles = async (
		formData: PutBulkJobRoleType,
	): Promise<
		BulkUpsertJobRoleResponse | ErrorResponse | ValidationErrorResponse
	> => {
		setIsLoading(true);
		setError(null);
		try {
			if (!jwt) {
				setError("JWTが見つかりません");
				throw new Error("JWTが見つかりません");
			}

			const res = await putBulkUpsertJobroles(jwt, formData);
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

	return { handleBulkUpsertJobroles, isLoading, error };
};
