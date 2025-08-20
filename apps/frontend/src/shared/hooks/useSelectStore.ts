// src/hooks/useSelectStore.ts
"use client";
import { setAuthToken } from "@/app/redux/slices/authToken";
import type { RootState } from "@/app/redux/store";
import type { SelectStoreResponse } from "@shared/api/auth/types/select-store";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postSelectStore } from "../api/select-store/api";

export function useSelectStore() {
	const dispatch = useDispatch();
	const jwt = useSelector((s: RootState) => s.authToken.jwt);

	const selectStore = useCallback(
		async (storeId: string): Promise<SelectStoreResponse | ErrorResponse> => {
			try {
				if (typeof window === "undefined") {
					throw new Error("useSelectStore must be used in a browser context");
				}
				if (!storeId) {
					throw new Error("storeId is required for select-store");
				}
				if (!jwt) {
					throw new Error("JWT is required for select-store");
				}
				if (!storeId) throw new Error("storeId is required");

				const res = await postSelectStore(jwt, storeId);

				if (!res.ok) {
					return { ok: false, message: res.message };
				}

				dispatch(setAuthToken({ jwt: res.token }));

				return res;
			} catch (error) {
				if (error instanceof Error) {
					return { ok: false, message: error.message };
				}
				return { ok: false, message: "Unexpected error during select-store" };
			}
		},
		[dispatch, jwt],
	);

	return { selectStore };
}
