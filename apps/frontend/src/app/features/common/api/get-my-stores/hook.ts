import { setStores } from "@/app/redux/slices/stores";
import type { AppDispatch, RootState } from "@/app/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyStores } from "./api";

export const useMystoresHooks = (trigger: boolean) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);

	const { userToken, storeToken } = useSelector(
		(state: RootState) => state.token,
	);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (!trigger || hasFetched || !userToken || !storeToken) return;

		const fetchPayment = async () => {
			try {
				setIsLoading(true);
				const res = await getMyStores(userToken, storeToken);

				if (!res.ok) {
					if ("errors" in res) {
						console.warn(res.message, res.errors);
						return;
					}
					console.error("エラー:", res.message);
					return;
				}

				dispatch(setStores(res.stores));
				setHasFetched(true); // ✅ 1回きりの実行制御
			} catch (err) {
				setError(true);
				console.error("エラー:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPayment();
	}, [trigger, hasFetched, userToken, storeToken, dispatch]);

	return { isLoading, error };
};
