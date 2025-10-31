"use client";
import { TEST_MODE } from "@/lib/env";
import { setAuthToken } from "@/redux/slices/authToken";
import type { RootState } from "@/redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLogin } from "../api/login/hook";
import { useMe } from "../api/me/hook";
import { useSelectStore } from "../api/select-store/hook";
import { useLiffVerify } from "../api/verify-liff/hook";

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
	const { jwt } = useSelector((state: RootState) => state.authToken);
	const dispatch = useDispatch();
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
			if (TEST_MODE) {
				setStep("getting-info");
				dispatch(setAuthToken({ jwt: "test" }));
				const meRes = await me({ jwt: "test" });
				if (!meRes.ok) {
					setError(meRes.message || "Failed to fetch user profile");
					setStep("error");
					return;
				}
				setStep("ready");
				return;
			}
			if (jwt) {
				setStep("getting-info");
				const meRes = await me({ jwt: jwt });
				if (!meRes.ok) {
					setError(meRes.message || "Failed to fetch user profile");
					setStep("error");
					return;
				}
				setStep("ready");
			}

			setStep("verifying");
			const vRes = await liffVerify();

			if (!vRes.ok) {
				setError(vRes.message || "LIFF verification failed");
				setStep("error");
				return;
			}
			if (vRes.next === "REGISTER") {
				setStep("unregistered");
				return;
			}
			if (vRes.next === "REDIRECTING") {
				setStep("redirecting");
				return;
			}
			if (vRes.next !== "LOGIN" || !vRes.token) {
				setError("Unexpected verify result");
				setStep("error");
				return;
			}

			setStep("logging-internal");
			const lRes = await login({ jwt: vRes.token });

			if (!lRes.ok) {
				setError(lRes.message || "login failed");
				setStep("error");
				return;
			}

			if (lRes.next === "AUTO") {
				setStep("getting-info");
				const meRes = await me({ jwt: lRes.token });
				if (!meRes.ok) {
					setError(meRes.message || "Failed to fetch user profile");
					setStep("error");
					return;
				}
				setStep("ready");
				return;
			}

			if (lRes.next === "SELECT_STORE") {
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
	}, [liffVerify, login, me, jwt, dispatch]);

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
				const meRes = await me({ jwt: sres.token });
				if (!meRes.ok) {
					setError(meRes.message || "Failed to fetch user profile");
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
