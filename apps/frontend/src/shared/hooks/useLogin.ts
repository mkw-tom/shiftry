// src/hooks/useLogin.ts
"use client";
import { setAuthToken } from "@/app/redux/slices/authToken";
import { setStore } from "@/app/redux/slices/store";
import { setStores } from "@/app/redux/slices/stores";
import { setUser } from "@/app/redux/slices/user";
import type { RootState } from "@/app/redux/store";
import type { NextKind } from "@shared/api/auth/types/login";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postLogin } from "../api/login/api";

export function useLogin() {
	const dispatch = useDispatch();
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const login = useCallback(async (): Promise<NextKind> => {
		if (!jwt) throw new Error("JWT is required for login");

		const res = await postLogin(jwt);
		if ("ok" in res && res.ok === false && "message" in res) {
			throw new Error(res.message || "login failed");
		}

		if (res?.kind === "SELECT_STORE") {
			dispatch(
				setUser({
					id: res.user.id,
					name: res.user.name,
					pictureUrl: res.user.pictureUrl,
				}),
			);
			dispatch(setStores(res.stores));
			return { next: "SELECT_STORE" };
		}

		if (res?.kind === "AUTO") {
			dispatch(
				setUser({
					id: res.user.id,
					name: res.user.name,
					pictureUrl: res.user.pictureUrl,
					role: res.role,
				}),
			);
			dispatch(
				setStore({
					id: res.store.id,
					name: res.store.name,
					isActive: res.store.isActive,
				}),
			);
			if (res.session?.access) {
				dispatch(setAuthToken({ jwt: res.session.access }));
			}

			return { next: "AUTO", storeId: res.store.id };
		}
		throw new Error("Unexpected login response");
	}, [dispatch, jwt]);

	return { login };
}
