import { saveShiftRequest } from "@/app/redux/slices/shiftRequests";
import type { AppDispatch, RootState } from "@/app/redux/store";

import {
	setGroupToken,
	setStoreToken,
	setUserToken,
} from "@/app/redux/slices/token";
import { setUser } from "@/app/redux/slices/user";
import type { userInputType } from "@shared/api/auth/validations/register-owner";
import type { storeIdandShfitReruestIdType } from "@shared/api/auth/validations/register-staff";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postRegisterStaff } from "./registerStaff";

export const usePostRegisterStaff = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { lineToken } = useSelector((state: RootState) => state.token);
	const { user } = useSelector((state: RootState) => state.user);

	const handleRegisterStaff = async ({
		name,
		storeInput,
	}: {
		name: string;
		storeInput: storeIdandShfitReruestIdType;
	}): Promise<{ ok: boolean }> => {
		setIsLoading(true);
		setError(null);
		try {
			if (!lineToken) {
				setError("LINEトークンが見つかりません。");
				alert("LINEトークンが見つかりません。");
				return { ok: false };
			}

			const userInput = {
				name: name,
				role: user?.role,
				pictureUrl: user?.pictureUrl,
			} as userInputType;

			const res = await postRegisterStaff({ lineToken, userInput, storeInput });
			if (!res.ok) {
				if ("errors" in res) {
					setError("通信エラーが発生しました");
					console.warn(res.message, res.errors);
					return { ok: false };
				}
				setError("通信エラーが発生しました");
				alert("通信エラーが発生しました");
				console.warn("エラー:", res.message);
				return { ok: false };
			}

			dispatch(setUserToken(res.user_token));
			dispatch(setStoreToken(res.store_token));
			dispatch(setGroupToken(res.group_token));

			return { ok: true };
		} catch (err) {
			setError("通信エラーが発生しました。");
			console.warn("エラー:", error);
			return { ok: false };
		} finally {
			setIsLoading(false);
		}
	};

	return { handleRegisterStaff, isLoading, error };
};
