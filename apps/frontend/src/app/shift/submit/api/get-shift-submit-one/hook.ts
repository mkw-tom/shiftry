"use client";
import type { RootState } from "@/redux/store";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetSubmittedShiftUserOneResponse } from "@shared/api/shift/submit/types/get-one";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { getSubmittedShiftUserOne } from "./api";

export const useGetSubmittedShiftUserOne = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const handleGetSubmitShiftUserOne = useCallback(
		async ({
			shiftRequestId,
		}: {
			shiftRequestId: string;
		}): Promise<GetSubmittedShiftUserOneResponse | ErrorResponse> => {
			setIsLoading(true);
			setError(null);
			try {
				if (!jwt) {
					return { ok: false, message: "ログイン情報がありません" };
				}
				if (!shiftRequestId) {
					return { ok: false, message: "シフトリクエストIDがありません" };
				}
				const res = await getSubmittedShiftUserOne({
					shiftRequestId,
					jwt,
				});
				if (!res.ok) {
					setError("通信エラーが発生しました");
					return { ok: false, message: res.message };
				}

				return res;
			} catch (err) {
				setError("通信エラーが発生しました。");
				window.alert("通信エラーが発生しました");
				return { ok: false, message: "通信エラーが発生しました" };
			} finally {
				setIsLoading(false);
			}
		},
		[jwt],
	);

	return { handleGetSubmitShiftUserOne, isLoading, error };
};
