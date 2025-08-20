// src/shared/hooks/useLiffInit.ts
"use client";
import liff from "@line/liff";
import { useEffect, useState } from "react";

type Options = {
	autoLogin?: boolean; // default true
	redirectUri?: string; // default: current url
	requireLiffContext?: boolean; // default false
};

export function useLiffInit(liffId: string, opts: Options = {}) {
	const {
		autoLogin = true,
		redirectUri = typeof window !== "undefined"
			? window.location.href
			: undefined,
		requireLiffContext = false,
	} = opts;

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				await liff.init({ liffId });
				// liff.ready は Promise。init完了後の安定待ち
				await liff.ready;

				const ctx = liff.getContext?.();

				if (requireLiffContext && ctx?.type === "none") {
					throw new Error(
						"このページはLINEアプリ内で開いてください（LIFFコンテキストなし）",
					);
				}

				if (!liff.isLoggedIn()) {
					if (autoLogin) {
						liff.login({ redirectUri }); // ← ここで遷移（戻らない）
						return;
					}
					if (!cancelled) setLoggedIn(false);
				} else {
					if (!cancelled) setLoggedIn(true);
				}
			} catch (e) {
				if (!cancelled) {
					const msg =
						e instanceof Error ? e.message : "LIFFの初期化に失敗しました";
					setError(msg);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [liffId, autoLogin, redirectUri, requireLiffContext]);

	return { loading, error, loggedIn };
}
