import type { RootState } from "@/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { UpdateStaffPreferenceResponse } from "@shared/api/staffPreference/types/update";
import type { UpdateStaffPreferenceInput } from "@shared/api/staffPreference/validations/update";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { staffPreferenceApi } from "../../path";
import { useFetch } from "../../useFetch";

export const useUpdateStaffPreference = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const updateStaffPreference = useCallback(
		async ({
			formData,
		}: {
			formData: UpdateStaffPreferenceInput;
		}): Promise<
			UpdateStaffPreferenceResponse | ErrorResponse | ValidationErrorResponse
		> => {
			setIsLoading(true);
			setError(null);
			try {
				if (!jwt) {
					setError("認証トークンが不足しています");
					throw new Error("認証トークンが不足しています");
				}

				const res = await useFetch<UpdateStaffPreferenceResponse>({
					jwt,
					method: "PUT",
					path: staffPreferenceApi.update,
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

	return { updateStaffPreference, isLoading, error };
};
