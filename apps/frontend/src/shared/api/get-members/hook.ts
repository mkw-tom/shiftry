import { setMembers } from "@/redux/slices/members";
import type { AppDispatch, RootState } from "@/redux/store";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { GetMemberFromStoreResponse } from "@shared/api/user/types/get-member";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMembers } from "./api";

export const useMembersHook = (trigger: boolean) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const { jwt } = useSelector((state: RootState) => state.authToken);

	useEffect(() => {
		const fetchGetMembers = async (): Promise<
			GetMemberFromStoreResponse | ErrorResponse
		> => {
			setIsLoading(true);
			try {
				if (!jwt) {
					setError(true);
					return { ok: false, message: "JWTが見つかりません" };
				}
				const res = await getMembers(jwt);
				if (!res.ok) {
					return { ok: false, message: res.message };
				}

				dispatch(setMembers(res.members));
				return res;
			} catch (err) {
				setError(true);
				return {
					ok: false,
					message:
						err instanceof Error ? err.message : "通信エラーが発生しました",
				};
			} finally {
				setIsLoading(false);
			}
		};

		fetchGetMembers();
	}, [dispatch, jwt]);

	return { isLoading, error };
};
