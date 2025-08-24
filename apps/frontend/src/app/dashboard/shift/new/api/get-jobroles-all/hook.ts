import type { AppDispatch, RootState } from "@/app/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { GetJobRolesResponse } from "@shared/api/jobRole/types/get";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobroles } from "./api";

export const useGetJobroles = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const handleGetJobroles = async (): Promise<
		GetJobRolesResponse | ErrorResponse | ValidationErrorResponse
	> => {
		setIsLoading(true);
		setError(null);
		try {
			if (!jwt) {
				setError("JWTが見つかりません");
				throw new Error("JWTが見つかりません");
			}

			const res = await getJobroles(jwt);
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

	return { handleGetJobroles, isLoading, error };
};
