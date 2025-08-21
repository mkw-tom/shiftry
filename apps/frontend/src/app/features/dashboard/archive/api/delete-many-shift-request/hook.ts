// import type { RootState } from "@/app/redux/store";
// import type { DeleteManyShiftRequestType } from "@shared/api/shift/request/validations/delete-many";
// import { useCallback, useState } from "react";
// import { useSelector } from "react-redux";
// import { set } from "zod/v4-mini";
// import { deleteManyShiftRequests } from "./api";

// export const useDeleteManyShiftRequests = () => {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);
// 	const { userToken, storeToken } = useSelector(
// 		(state: RootState) => state.token,
// 	);

// 	const handleDeleteManyShiftRequests = async ({
// 		ids,
// 	}: {
// 		ids: string[];
// 	}) => {
// 		setIsLoading(true);
// 		setError(null);

// 		try {
// 			if (!userToken || !storeToken) {
// 				setError("ユーザートークンまたはストアトークンが見つかりません");
// 				throw new Error("ユーザートークンまたはストアトークンが見つかりません");
// 			}

// 			const res = await deleteManyShiftRequests({ userToken, storeToken, ids });

// 			if (!res.ok) {
// 				const message = res.message ?? "通信エラーが発生しました";
// 				setError(message);
// 				throw new Error(message);
// 			}

// 			return res;
// 		} catch (err) {
// 			setError("通信エラーが発生しました");
// 			return null;
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	return { handleDeleteManyShiftRequests, isLoading, error, setError };
// };
