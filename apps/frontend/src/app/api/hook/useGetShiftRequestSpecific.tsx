"use client";
import type { RootState } from "@/redux/store";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetShiftRequestSpecificResponse } from "@shared/api/shift/request/types/get-by-id";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { shiftReqeustApi } from "../path";
import { useFetch } from "../useFetch";

export const useGetShiftRequestSpecific = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const getShiftRequestSpecific = useCallback(
		async ({
			shiftRequestId,
		}: {
			shiftRequestId: string;
		}): Promise<GetShiftRequestSpecificResponse | ErrorResponse> => {
			setIsLoading(true);
			setError(null);
			try {
				if (!jwt) {
					return { ok: false, message: "認証トークンが不足しています" };
				}

				if (!shiftRequestId) {
					return { ok: false, message: "シフトリクエストIDがありません" };
				}

				const res = await useFetch<GetShiftRequestSpecificResponse>({
					jwt,
					method: "GET",
					path: shiftReqeustApi.get(shiftRequestId),
				});

				if (!res.ok) {
					setError("通信エラーが発生しました");
					return res;
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

	return { getShiftRequestSpecific, isLoading, error };
};
