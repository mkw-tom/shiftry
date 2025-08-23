import { setStores } from "@/app/redux/slices/stores";
import type { AppDispatch, RootState } from "@/app/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyStores } from "./api";

export const useMystoresHooks = (trigger: boolean) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const { jwt } = useSelector((state: RootState) => state.authToken);

	useEffect(() => {
		if (!trigger) return;

		const fetchPayment = async () => {
			try {
				setIsLoading(true);
				setError(false);

				if (!jwt) {
					setError(true);
					return;
				}
				const res = await getMyStores(jwt);

				if (!res.ok) {
					return { ok: false, message: res.message };
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
	}, [trigger, dispatch, jwt]);

	return { isLoading, error };
};
