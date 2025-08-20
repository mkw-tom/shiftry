// src/hooks/useLiffVerify.ts
"use client";
import { setAuthToken } from "@/app/redux/slices/authToken";
import liff from "@line/liff";
import type { VerifyLiffUserResponse } from "@shared/api/auth/types/liff-verify";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { postVerifyLiff } from "../api/verify-liff/api";

type Options = { liffId: string };

export function useLiffVerify({ liffId }: Options) {
	const dispatch = useDispatch();
	const inflight = useRef(false);

	const liffVerify = useCallback(async (): Promise<
		VerifyLiffUserResponse | ErrorResponse | ValidationErrorResponse
	> => {
		if (typeof window === "undefined") {
			// これは想定外なので throw
			throw new Error("useLiffVerify must be used in a browser context");
		}
		if (inflight.current) {
			throw new Error("Liff verification is already in progress");
		}
		inflight.current = true;

		try {
			await liff.init({ liffId });

			if (!liff.isLoggedIn()) {
				liff.login();
				return { ok: true, next: "REDIRECTING" };
			}

			const ctx = liff.getContext?.();
			if (ctx?.type === "none") {
				// 想定可能なUX分岐 → return
				return {
					ok: false,
					message:
						"このページはLINEアプリ内で開いてください（LIFFコンテキストなし）",
				};
			}

			const idToken = liff.getIDToken();
			if (!idToken) {
				// 想定外（LIFFの状態おかしい）→ throw
				throw new Error("ID Token is required for verification");
			}

			const res = await postVerifyLiff(idToken);
			if ("ok" in res && res.ok === false) {
				return res;
			}

			if (res.next === "REGISTER") return res;

			if (res.next === "LOGIN" && res.token) {
				dispatch(setAuthToken({ jwt: res.token }));
				return res;
			}

			return {
				ok: false,
				message: "Unexpected response from LIFF verification",
			};
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Unexpected error";
			return { ok: false, message: msg };
		} finally {
			inflight.current = false;
		}
	}, [liffId, dispatch]);

	return { liffVerify };
}
