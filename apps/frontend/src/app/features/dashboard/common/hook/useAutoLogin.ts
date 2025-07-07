import { setShiftRequests } from "@/app/redux/slices/shiftRequests";
import { setStore } from "@/app/redux/slices/store";
import { setStores } from "@/app/redux/slices/stores";
import {
	setGroupToken,
	setStoreToken,
	setUserToken,
} from "@/app/redux/slices/token";
import { setUser } from "@/app/redux/slices/user";
import type { AppDispatch } from "@/app/redux/store";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { autoLogin } from "../api/auto-login";

export const useAutoLogin = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);
	const dispatch = useDispatch<AppDispatch>();

	const handleAutoLogin = async ({
		userToken,
		storeToken,
		groupToken,
	}: {
		userToken: string;
		storeToken: string;
		groupToken: string;
	}): Promise<{ ok: boolean }> => {
		setIsLoading(true);
		setError(false);
		try {
			const res = await autoLogin({ userToken, storeToken, groupToken });
			if (!res.ok) {
				if ("errors" in res) {
					setError(true);

					console.warn(res.message, res.errors);
					return { ok: false };
				}
				setError(true);
				console.warn("エラー:", res.message);
				return { ok: false };
			}

			dispatch(setUserToken(res.user_token));
			dispatch(setStoreToken(res.store_token));
			dispatch(setGroupToken(res.group_token));
			dispatch(setUser(res.user));
			dispatch(setStore(res.store));
			dispatch(setShiftRequests(res.shiftRequests));
			return { ok: true };
		} catch (err) {
			console.warn("通信エラー:", err);
			return { ok: false };
		} finally {
			setIsLoading(false);
		}
	};

	return { handleAutoLogin, isLoading, error, setError };
};
