// src/hooks/useAuthFlow.ts
"use client";
import type { RootState } from "@/app/redux/store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { useLiffVerify } from "./useLiffVerify";
import { useLogin } from "./useLogin";
import { useSelectStore } from "./useSelectStore";

export type Step =
	| "idle"
	| "verifying" // /auth/liff/verify 実行中（必要ならLIFF loginリダイレクト）
	| "logging-internal" // /auth/login 実行中
	| "need-store" // 店舗選択待ち
	| "selecting" // /auth/select-store 実行中
	| "ready" // セッション確立
	// | "skipped" // 既にJWTがあり verify をスキップ
	| "unregistered" // LIFF未登録（verifyでREGISTERが返った）
	| "error";

type Options = {
	liffId: string;
	autoRun?: boolean; // 既定: true（初回リロードで必ず実行）
	autoSelectLastStore?: boolean; // 既定: true（lastStoreId が候補にあれば自動選択）
};

export function useAuthFlow({
	liffId,
	autoRun = true,
	autoSelectLastStore = true,
}: Options) {
	// Reduxから必要情報だけ
	const { user } = useSelector((s: RootState) => s.user);
	const { liffVerify } = useLiffVerify({ liffId });
	const { login } = useLogin();
	const { selectStore } = useSelectStore();

	const [step, setStep] = useState<Step>("idle");
	const [error, setError] = useState<string | null>(null);

	const started = useRef(false); // StrictMode 二重発火対策
	const inflight = useRef(false);

	// localStorage helpers（安全try/catch）
	const getLastStoreId = useCallback((): string | null => {
		if (typeof window === "undefined" || !user?.id) return null;
		try {
			return localStorage.getItem(`lastStoreId:${user.id}`);
		} catch {
			return null;
		}
	}, [user?.id]);

	const setLastStoreId = useCallback(
		(storeId: string) => {
			if (typeof window === "undefined" || !user?.id) return;
			try {
				localStorage.setItem(`lastStoreId:${user.id}`, storeId);
			} catch {}
		},
		[user?.id],
	);

	// 認証・ログイン・店舗選択まで一気通貫
	const run = useCallback(async () => {
		if (started.current || inflight.current) return;
		started.current = true;
		inflight.current = true;
		setError(null);

		try {
			setStep("verifying");
			const vres = await liffVerify();
			if (vres?.next === "REGISTER") {
				setStep("unregistered");
				return;
			}

			// 2) /auth/login（サーバが AUTO or SELECT_STORE を返す想定）
			setStep("logging-internal");
			const r = await login(); // { next: 'auto' | 'select-store', store? / stores? }
			if (r?.next === "AUTO") {
				setStep("ready");
				setLastStoreId(r.storeId);
				return;
			}

			if (r?.next === "SELECT_STORE" && autoSelectLastStore) {
				const lastStoreId = getLastStoreId();
				if (lastStoreId) {
					setStep("selecting");
					await selectStore(lastStoreId);
					setLastStoreId(lastStoreId);
					setStep("ready");
					return;
				}
			}

			// 3) 店舗選択が必要
			setStep("need-store");
		} catch (e) {
			const errorMessage =
				typeof e === "object" && e !== null && "message" in e
					? ((e as { message?: string }).message ?? "auth flow failed")
					: "auth flow failed";
			setError(errorMessage);
			setStep("error");
			throw e;
		} finally {
			inflight.current = false;
		}
	}, [
		liffVerify,
		login,
		autoSelectLastStore,
		// user?.id,
		selectStore,
		getLastStoreId,
		setLastStoreId,
	]);

	// UIから選択された時に呼ぶ
	const chooseStore = useCallback(
		async (storeId: string) => {
			setError(null);
			setStep("selecting");
			try {
				await selectStore(storeId);
				setLastStoreId(storeId);
				setStep("ready");
			} catch (e) {
				const errorMessage =
					typeof e === "object" && e !== null && "message" in e
						? ((e as { message?: string }).message ?? "select store failed")
						: "select store failed";
				setError(errorMessage);
				setStep("need-store");
				throw e;
			}
		},
		[selectStore, setLastStoreId],
	);

	// 初回リロードで必ず実行
	useEffect(() => {
		if (autoRun) run().catch(() => void 0);
	}, [autoRun, run]);

	return { step, error, run, chooseStore };
}
export default useAuthFlow;
