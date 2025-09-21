import type { AppDispatch, RootState } from "@/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";

import type { GetAssignShiftResponse } from "@shared/api/shift/assign/types/get-by-shift-request-id";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignShiftApi } from "../path";
import { useFetch } from "../useFetch";

export const useGetAssignShfit = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const getAssignShift = useCallback(
		async ({
			shiftRequestId,
		}: {
			shiftRequestId: string;
		}): Promise<GetAssignShiftResponse | ErrorResponse> => {
			setIsLoading(true);
			setError(null);
			if (!shiftRequestId) {
				setError("シフトリクエストIDが見つかりません");
				throw new Error("シフトリクエストIDが見つかりません");
			}
			try {
				if (!jwt) {
					setError("認証トークンが不足しています");
					throw new Error("認証トークンが不足しています");
				}

				if (!shiftRequestId) {
					setError("シフトリクエストIDが見つかりません");
					throw new Error("シフトリクエストIDが見つかりません");
				}

				const res = await useFetch<GetAssignShiftResponse>({
					jwt,
					method: "GET",
					path: assignShiftApi.get(shiftRequestId),
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

	return { getAssignShift, isLoading, error };
};
