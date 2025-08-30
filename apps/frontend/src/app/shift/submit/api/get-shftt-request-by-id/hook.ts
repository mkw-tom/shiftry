import type { RootState } from "@/redux/store";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetShiftRequestSpecificResponse } from "@shared/api/shift/request/types/get-by-id";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { getShiftRequestSpecific } from "./api";

export const useGetShiftRequestSpecific = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const handleGetShiftRequestSpecific = useCallback(
		async ({
			shiftRequestId,
		}: {
			shiftRequestId: string;
		}): Promise<GetShiftRequestSpecificResponse | ErrorResponse> => {
			setIsLoading(true);
			setError(null);
			try {
				if (!jwt) {
					return { ok: false, message: "ログイン情報がありません" };
				}
				if (!shiftRequestId) {
					return { ok: false, message: "シフトリクエストIDがありません" };
				}
				const res = await getShiftRequestSpecific({
					shiftRequestId,
					jwt,
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

	return { handleGetShiftRequestSpecific, isLoading, error };
};
