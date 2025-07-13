import type { RootState } from "@/app/redux/store";
import { SubmittedShiftWithJson } from "@shared/api/common/types/merged";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { getArchiveShiftRequests } from "./api";

export const useGetArchiveShiftRequests = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGetArchiveShiftRequests = useCallback(
		async ({
			userToken,
			storeToken,
		}: {
			userToken: string | null;
			storeToken: string | null;
		}) => {
			setIsLoading(true);
			setError(null);

			try {
				if (!userToken || !storeToken) {
					throw new Error(
						"ユーザートークンまたはストアトークンが見つかりません",
					);
				}

				const res = await getArchiveShiftRequests({ userToken, storeToken });

				if (!res.ok) {
					const message = res.message ?? "通信エラーが発生しました";
					throw new Error(message);
				}

				return res.shiftRequests;
			} catch (err) {
				setError("通信エラーが発生しました");
				return null;
			} finally {
				setIsLoading(false); // どんな場合でもここでOFFになる
			}
		},
		[],
	);

	return { handleGetArchiveShiftRequests, isLoading, error, setError };
};
