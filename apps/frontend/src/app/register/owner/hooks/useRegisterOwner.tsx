import { liffId } from "@/app/lib/env";
import { setAuthToken } from "@/app/redux/slices/authToken";
import { setStore } from "@/app/redux/slices/store";
import { setUser } from "@/app/redux/slices/user";
import liff from "@line/liff";
import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import type { RegisterOwnerResponse } from "@shared/api/auth/types/register-owner";
import type {
	StoreNameType,
	userInputType,
} from "@shared/api/auth/validations/register-owner";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import { postRegisterOwner } from "../api/registerOwner";

type RegisterResult =
	| { ok: true; data: RegisterOwnerResponse }
	| { ok: false; message: string };

const useRegisterOwner = () => {
	const dispatch = useDispatch();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const inflight = useRef(false); // 二重送信ガード

	const registerOwner = useCallback(
		async (ownerName: string, storeName: string): Promise<RegisterResult> => {
			if (inflight.current) return { ok: false, message: "処理中です…" };
			inflight.current = true;
			setLoading(true);
			setError(null);

			try {
				await liff.init({ liffId: liffId.registerOwner });

				if (!liff.isLoggedIn()) {
					liff.login({ redirectUri: window.location.href });
					return { ok: false, message: "ログインへリダイレクトしました" };
				}

				const idToken = liff.getIDToken();
				if (!idToken) throw new Error("ID Token not found");
				const profile = await liff.getProfile().catch(() => null);

				const userInput: userInputType = {
					name: ownerName?.trim() || profile?.displayName || "",
					pictureUrl: profile?.pictureUrl || "",
				};
				const storeInput: StoreNameType = { name: storeName?.trim() };

				const response = await postRegisterOwner(
					idToken,
					userInput,
					storeInput,
				);

				if (!("ok" in response) || response.ok !== true) {
					const msg =
						(response as ErrorResponse | ValidationErrorResponse)?.message ||
						"登録に失敗しました";
					throw new Error(msg);
				}

				dispatch(
					setUser({
						id: response.user.id,
						name: response.user.name,
						pictureUrl: response.user.pictureUrl,
					}),
				);
				dispatch(
					setStore({
						id: response.store.id,
						name: response.store.name,
						isActive: response.store.isActive,
					}),
				);

				return { ok: true, data: response };
			} catch (e) {
				const msg =
					e instanceof Error ? e.message : "不明なエラーが発生しました";
				setError(msg);
				return { ok: false, message: msg };
			} finally {
				setLoading(false);
				inflight.current = false;
			}
		},
		[dispatch],
	);

	return { registerOwner, error, loading };
};

export default useRegisterOwner;
