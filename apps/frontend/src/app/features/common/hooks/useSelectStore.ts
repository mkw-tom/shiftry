// src/hooks/useSelectStore.ts
"use client";
import { setAuthToken } from "@/app/redux/slices/authToken";
import { setStore } from "@/app/redux/slices/store";
import { setStores } from "@/app/redux/slices/stores";
import { setUser } from "@/app/redux/slices/user";
import type { RootState } from "@/app/redux/store";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postSelectStore } from "../api/select-store/api";

export function useSelectStore() {
	const dispatch = useDispatch();
	const jwt = useSelector((s: RootState) => s.authToken.jwt);
	const { user } = useSelector((s: RootState) => s.user); // ← スライス定義に合わせてここを決める

	const selectStore = useCallback(
		async (storeId: string): Promise<{ ok: true; storeId?: string }> => {
			if (!jwt) throw new Error("JWT is required for select-store");
			if (!storeId) throw new Error("storeId is required");
			if (!user?.id) throw new Error("User is not logged in");

			const res = await postSelectStore(jwt, storeId);

			if (!res.ok) {
				// 後で code 別 UI 制御に差し替え
				throw new Error(res.message || "Select store failed");
			}

			dispatch(setAuthToken({ jwt: res.session.access }));
			dispatch(setStore(res.store));
			dispatch(
				setUser({
					id: user.id,
					name: user.name,
					pictureUrl: user.pictureUrl,
					role: res.role,
				}),
			);
			dispatch(setStores([]));

			return { ok: true, storeId: res.store.id };
		},
		[dispatch, jwt, user],
	);

	return { selectStore };
}
