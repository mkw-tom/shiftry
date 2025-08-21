"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLiffVerify } from "./useLiffVerify";
import { useLogin } from "./useLogin";
import { useMe } from "./useMe";
import { useSelectStore } from "./useSelectStore";

export type Step =
	| "idle"
	| "verifying"
	| "redirecting"
	| "logging-internal"
	| "need-store"
	| "selecting"
	| "getting-info"
	| "ready"
	| "unregistered"
	| "error";

type Options = {
	liffId: string;
	autoRun?: boolean;
};

export function useAuthFlow({ liffId, autoRun = true }: Options) {
	const { liffVerify } = useLiffVerify({ liffId });
	const { login } = useLogin();
	const { selectStore } = useSelectStore();
	const { me } = useMe();

	const [step, setStep] = useState<Step>("idle");
	const [error, setError] = useState<string | null>(null);

	const started = useRef(false);
	const inflight = useRef(false);

	const run = useCallback(async () => {
		if (started.current || inflight.current) return;
		started.current = true;
		inflight.current = true;
		setError(null);

		try {
			setStep("verifying");
			const vres = await liffVerify();

			if (!vres.ok) {
				setError(vres.message || "LIFF verification failed");
				setStep("error");
				return;
			}
			if (vres.next === "REGISTER") {
				setStep("unregistered");
				return;
			}
			if (vres.next === "REDIRECTING") {
				setStep("redirecting");
				return;
			}
			if (vres.next !== "LOGIN" || !vres.token) {
				setError("Unexpected verify result");
				setStep("error");
				return;
			}

			setStep("logging-internal");
			const lres = await login({ jwt: vres.token });

			if (!lres.ok) {
				setError(lres.message || "login failed");
				setStep("error");
				return;
			}

			if (lres.next === "AUTO") {
				setStep("getting-info");
				const meres = await me({ jwt: lres.token });
				if (!meres.ok) {
					setError(meres.message || "Failed to fetch user profile");
					setStep("error");
					return;
				}
				setStep("ready");
				return;
			}

			if (lres.next === "SELECT_STORE") {
				setStep("need-store");
				return;
			}

			setError("unknown login result");
			setStep("error");
		} catch (e) {
			const errorMessage =
				typeof e === "object" && e !== null && "message" in e
					? ((e as { message?: string }).message ?? "auth flow failed")
					: "auth flow failed";
			setError(errorMessage);
			setStep("error");
			// 任意: 再実行を許す
			started.current = false;
		} finally {
			inflight.current = false;
		}
	}, [liffVerify, login, me]);

	const chooseStore = useCallback(
		async (storeId: string) => {
			setError(null);
			setStep("selecting");
			try {
				const sres = await selectStore(storeId);
				if (!sres.ok) {
					setError(sres.message || "select store failed");
					setStep("need-store");
					return;
				}
				setStep("getting-info");
				const meres = await me({ jwt: sres.token });
				if (!meres.ok) {
					setError(meres.message || "Failed to fetch user profile");
					setStep("error");
					return;
				}
				setStep("ready");
			} catch (e) {
				const errorMessage =
					typeof e === "object" && e !== null && "message" in e
						? ((e as { message?: string }).message ?? "select store failed")
						: "select store failed";
				setError(errorMessage);
				setStep("need-store");
			}
		},
		[selectStore, me],
	);

	useEffect(() => {
		if (autoRun) run().catch(() => void 0);
	}, [autoRun, run]);

	return { step, error, run, chooseStore };
}

export default useAuthFlow;
