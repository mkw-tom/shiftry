// useLiffInit.ts
"use client";
import liff from "@line/liff";
import { useEffect, useState } from "react";

type Options = {
	autoLogin?: boolean; // 既定 true: 未ログインなら login() まで行う
	redirectUri?: string; // 既定: 現在のURL
	requireLiffContext?: boolean; // 既定 false: LINE外ブラウザでも許容
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
				await liff.ready;

				const ctx = liff.getContext();

				if (requireLiffContext && ctx?.type === "none") {
					throw new Error(
						"このページはLINEアプリ内で開いてください（LIFFコンテキストなし）",
					);
				}

				if (!liff.isLoggedIn()) {
					if (autoLogin) {
						liff.login({ redirectUri });
						return;
					}
					setLoggedIn(false);
				} else {
					setLoggedIn(true);
				}
			} catch (e) {
				if (!cancelled) {
					const errorMessage =
						e instanceof Error ? e.message : "LIFFの初期化に失敗しました";
					setError(errorMessage);
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
