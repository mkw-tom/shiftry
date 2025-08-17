"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import useAuthFlow, { type Step } from "../hooks/useAuthFlow";

type AuthContextType = {
	step: Step;
	error: string | null;
	run: () => Promise<void>;
	chooseStore: (storeId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
	children,
	liffId,
	autoRun = true,
	autoSelectLastStore = true,
}: {
	children: React.ReactNode;
	liffId: string;
	autoRun?: boolean;
	autoSelectLastStore?: boolean;
}) {
	const { step, error, run, chooseStore } = useAuthFlow({
		liffId,
		autoRun: false, // ← Provider が実行タイミングを管理
		autoSelectLastStore,
	});

	// 初回のみ実行（StrictMode対策は useAuthFlow 内の ref で済んでいる）
	useEffect(() => {
		if (autoRun) {
			run().catch(() => void 0);
		}
	}, [autoRun, run]);

	const value = useMemo(
		() => ({ step, error, run, chooseStore }),
		[step, error, run, chooseStore],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
	return ctx;
}
