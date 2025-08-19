// useUnconnectedStore.ts
"use client";

import type { RootState } from "@/app/redux/store";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { UserStoreLiteWithStore } from "@shared/api/common/types/prismaLite";
import type { GetUnconnectedStoresMeResponse } from "@shared/api/store/types/me-unconnected";
import { useCallback, useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getUnconnectedStores } from "../api/getUnconnectedStores";

type Data = GetUnconnectedStoresMeResponse | null;

export default function useUnconnectedStore() {
	const jwt = useSelector((s: RootState) => s.authToken.jwt, shallowEqual);

	const [unconnectedStores, setUnconnectedStores] = useState<
		UserStoreLiteWithStore[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [error, setErr] = useState<string | null>(null);

	const inflight = useRef(false);

	const fetchUnconnectedStores = useCallback(async () => {
		if (!jwt || inflight.current) return;
		inflight.current = true;
		setLoading(true);
		setErr(null);

		// 中断対策（コンポーネントの切り替えでレスポンスが遅れても無視できる）
		const alive = { v: true };
		try {
			const res = await getUnconnectedStores(jwt);
			if ("ok" in res && res.ok) {
				if (alive.v) setUnconnectedStores(res.unconnectedStores);
			} else {
				const msg = (res as ErrorResponse)?.message ?? "Failed to fetch stores";
				throw new Error(msg);
			}
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : "Unknown error";
			if (alive.v) setErr(errorMessage);
		} finally {
			if (alive.v) setLoading(false);
			inflight.current = false;
		}
		return () => {
			alive.v = false;
		};
	}, [jwt]);

	// jwt がセット/更新されたら自動フェッチ
	useEffect(() => {
		if (!jwt) {
			// 未ログインの間はクリアして待機（エラーは出さない）
			setUnconnectedStores([]);
			setErr(null);
			setLoading(false);
			return;
		}
		// 初回 & jwt 変更時
		fetchUnconnectedStores();
	}, [jwt, fetchUnconnectedStores]);

	return {
		unconnectedStores,
		loading,
		error,
		refetch: fetchUnconnectedStores,
		isReady: !!jwt, // 画面側で「JWTまだ→何もしない」を判定しやすくする
	};
}
