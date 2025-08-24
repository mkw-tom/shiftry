import type { AppDispatch, RootState } from "@/app/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import { GetJobRolesResponse } from "@shared/api/jobRole/types/get";
import type { GetShfitPositionsResponse } from "@shared/api/shiftPosition/types/get-by-store-id";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShiftPositions } from "./api";

export const useGetShfitPositions = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const handleGetShiftPositions = async (): Promise<
		GetShfitPositionsResponse | ErrorResponse | ValidationErrorResponse
	> => {
		setIsLoading(true);
		setError(null);
		try {
			if (!jwt) {
				setError("JWTが見つかりません");
				throw new Error("JWTが見つかりません");
			}

			const res = await getShiftPositions(jwt);
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
	};

	return { handleGetShiftPositions, isLoading, error };
};
