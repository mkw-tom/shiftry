// src/hooks/useLogin.ts
"use client";
import { setAuthToken } from "@/app/redux/slices/authToken";
import { setStore } from "@/app/redux/slices/store";
import { setStores } from "@/app/redux/slices/stores";
import { setUser } from "@/app/redux/slices/user";
import type { RootState } from "@/app/redux/store";
import type { LoginResponse } from "@shared/api/auth/types/login";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postLogin } from "../api/login/api";

export function useLogin() {
	const dispatch = useDispatch();
	// const { jwt } = useSelector((state: RootState) => state.authToken);

	const login = useCallback(
		async ({
			jwt,
		}: { jwt: string }): Promise<LoginResponse | ErrorResponse> => {
			try {
				if (typeof window === "undefined") {
					throw new Error("useLogin must be used in a browser context");
				}
				if (!jwt) {
					throw new Error("JWT is required for login");
				}

				const res = await postLogin(jwt);
				if ("ok" in res && res.ok === false && "message" in res) {
					throw new Error(res.message || "login failed");
				}

				if (res?.next === "SELECT_STORE") {
					dispatch(setStores(res.stores));
					return res;
				}

				if (res?.next === "AUTO") {
					dispatch(setAuthToken({ jwt: res.token }));
					return res;
				}

				throw new Error("Unexpected login response");
			} catch (error) {
				if (error instanceof Error) {
					return { ok: false, message: error.message };
				}
				return { ok: false, message: "Unexpected error during login" };
			}
		},
		[dispatch],
	);

	return { login };
}
