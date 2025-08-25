// src/hooks/useLiffVerify.ts
"use client";
import { setActiveShiftRequests } from "@/redux/slices/activeShiftRequests";
import { setMembers } from "@/redux/slices/members";
import { setStore } from "@/redux/slices/store";
import { setUser } from "@/redux/slices/user";
import type { RootState } from "@/redux/store";
import type { AuthMeResponse } from "@shared/api/auth/types/me";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./api";

type Options = { liffId: string };

export function useMe() {
	const dispatch = useDispatch();
	const [getting, setGetting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// const { jwt } = useSelector((state: RootState) => state.authToken);

	const me = useCallback(
		async ({
			jwt,
		}: { jwt: string }): Promise<
			AuthMeResponse | ErrorResponse | ValidationErrorResponse
		> => {
			setGetting(true);
			setError(null);
			if (typeof window === "undefined") {
				throw new Error("useLiffVerify must be used in a browser context");
			}

			if (!jwt) {
				throw new Error("JWT is required for login");
			}

			try {
				const res = await getMe(jwt);
				if ("ok" in res && res.ok === false) {
					setError(res.message);
					return res;
				}

				dispatch(
					setUser({
						id: res.user.id,
						name: res.user.name,
						pictureUrl: res.user.pictureUrl,
						role: res.role,
					}),
				);
				dispatch(setStore(res.store));
				dispatch(setActiveShiftRequests(res.ActiveShiftRequests));
				dispatch(setMembers(res.members));

				return res;
			} catch (e) {
				const msg = e instanceof Error ? e.message : "Unexpected error";
				setError(msg);
				return { ok: false, message: msg };
			} finally {
				setGetting(false);
			}
		},
		[dispatch],
	);

	return { me, getting, error };
}
