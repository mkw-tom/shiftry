// src/hooks/useLiffVerify.ts
"use client";
import { setAuthToken } from "@/app/redux/slices/authToken";
import liff from "@line/liff";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { postVerifyLiff } from "../api/verify-liff/api";

type Options = {
	liffId: string;
};

export function useLiffVerify({ liffId }: Options) {
	const dispatch = useDispatch();

	const liffVerify = useCallback(async () => {
		if (typeof window === "undefined") throw new Error("client only");

		// init → login
		await liff.init({ liffId });
		if (!liff.isLoggedIn()) {
			liff.login(); // リダイレクト
			return; // 以降は戻らない
		}

		// LIFFコンテキストから channel を取得
		const ctx = liff.getContext();
		// ctx.type: "utou" | "group" | "room" | "none"
		const channelType = ctx?.type;
		if (
			!channelType ||
			(channelType !== "utou" &&
				channelType !== "group" &&
				channelType !== "room")
		) {
			throw new Error("Unsupported LIFF context");
		}
		const channelId =
			channelType === "group"
				? ctx.groupId
				: channelType === "room"
					? ctx.roomId
					: undefined;

		const idToken = liff.getIDToken();
		if (!idToken) throw new Error("ID Token not found");

		const profile = await liff.getProfile().catch(() => null);

		// backendは channel.id が null の utou も受けられる実装にしてある前提
		const res = await postVerifyLiff(idToken, channelId, channelType);
		if ("ok" in res && res.ok === false && "message" in res) {
			throw new Error(`verify failed: ${res.message}`);
		}

		const jwt: string | undefined = res.token;
		if (!jwt) throw new Error("jwt not returned");

		// Redux保存（メモリのみでOK）
		dispatch(setAuthToken({ jwt }));

		return {
			jwt,
			profile: profile
				? { displayName: profile.displayName, pictureUrl: profile.pictureUrl }
				: undefined,
			flags: res.flags ?? undefined,
			next: res.next as "LOGIN" | "REGISTER",
		};
	}, [liffId, dispatch]);

	return { liffVerify };
}
