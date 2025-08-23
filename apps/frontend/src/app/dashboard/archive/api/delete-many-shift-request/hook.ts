import type { RootState } from "@/app/redux/store";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { DeleteManyShiftRequestResponse } from "@shared/api/shift/request/types/delete-many";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { set } from "zod/v4-mini";
import { deleteManyShiftRequests } from "./api";

export const useDeleteManyShiftRequests = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const handleDeleteManyShiftRequests = async (
		ids: string[],
	): Promise<DeleteManyShiftRequestResponse | ErrorResponse> => {
		setIsLoading(true);
		setError(null);

		try {
			if (!jwt) {
				setError("JWTが見つかりません");
				throw new Error("JWTが見つかりません");
			}
			const res = await deleteManyShiftRequests(jwt, ids);

			if (!res.ok && res.message) {
				const message = res.message ?? "通信エラーが発生しました";
				if ("errors" in res) {
					throw new Error(
						`error: ${res.message}. validatioinError: ${res.errors}`,
					);
				}
				setError(message);
				throw new Error(message);
			}

			return res;
		} catch (err) {
			setError("通信エラーが発生しました");
			return {
				ok: false,
				message: err instanceof Error ? err.message : "不明なエラー",
			};
		} finally {
			setIsLoading(false);
		}
	};

	return { handleDeleteManyShiftRequests, isLoading, error, setError };
};
