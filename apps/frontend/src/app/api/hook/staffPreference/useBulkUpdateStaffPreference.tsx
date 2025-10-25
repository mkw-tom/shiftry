import type { RootState } from "@/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { UpdateBulkStaffPreferenceResponse } from "@shared/api/staffPreference/types/update_bulk";
import type { UpdateBulkStaffPreferenceInput } from "@shared/api/staffPreference/validations/update_bulk";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { staffPreferenceApi } from "../../path";
import { useFetch } from "../../useFetch";

export const useBulkUpdateStaffPreference = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const bulkUpdateStaffPreference = useCallback(
		async ({
			formData,
		}: {
			formData: UpdateBulkStaffPreferenceInput;
		}): Promise<
			| UpdateBulkStaffPreferenceResponse
			| ErrorResponse
			| ValidationErrorResponse
		> => {
			setIsLoading(true);
			setError(null);
			try {
				if (!jwt) {
					setError("認証トークンが不足しています");
					throw new Error("認証トークンが不足しています");
				}

				const res = await useFetch<UpdateBulkStaffPreferenceResponse>({
					jwt,
					method: "PUT",
					path: staffPreferenceApi.create,
					body: formData,
				});

				if (!res.ok) {
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
		},
		[jwt],
	);

	return { bulkUpdateStaffPreference, isLoading, error };
};
