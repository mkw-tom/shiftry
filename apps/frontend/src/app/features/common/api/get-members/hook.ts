import { setMembers } from "@/app/redux/slices/members";
import type { AppDispatch, RootState } from "@/app/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMembers } from "./api";

export const useMembersHook = (trigger: boolean) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	const { userToken, storeToken } = useSelector(
		(state: RootState) => state.token,
	);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (!trigger || !userToken || !storeToken) return;

		const fetchPayment = async () => {
			try {
				setIsLoading(true);
				const res = await getMembers(userToken, storeToken);

				if (!res.ok) {
					if ("errors" in res) {
						console.warn(res.message, res.errors);
						return;
					}
					console.error("エラー:", res.message);
					return;
				}

				dispatch(setMembers(res.storeUsers));
			} catch (err) {
				setError(true);
				console.error("エラー:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPayment();
	}, [trigger, userToken, storeToken, dispatch]);

	return { isLoading, error };
};
