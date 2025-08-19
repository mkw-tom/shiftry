"use client";
import { setStore } from "@/app/redux/slices/store";
import liff from "@line/liff";
import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { postConnectLineGroup } from "../api/connectLineGroup";

export const useConnectStore = () => {
	const [connecting, setConnecting] = useState(false);
	const [connectError, setConnectError] = useState<string | null>(null);
	const dispatch = useDispatch();

	const connectStore = useCallback(
		async (storeId: string) => {
			setConnecting(true);
			setConnectError(null);
			try {
				const idToken = liff.getIDToken();
				if (!idToken) throw new Error("ID Token not found");
				const ctx = liff.getContext();
				const channelType = ctx?.type;
				if (!channelType || channelType !== "group") {
					throw new Error("Unsupported LIFF context");
				}
				const channelId = ctx.groupId;

				const response = await postConnectLineGroup(
					idToken,
					channelId,
					channelType,
					storeId,
				);

				if (!("ok" in response) || response.ok !== true) {
					const msg = response.message || "Store connection failed";
					throw new Error(msg);
				}

				dispatch(setStore(response.store));
				return {
					ok: true,
					data: response,
				};
			} catch (error) {
				setConnectError(
					error instanceof Error ? error.message : "Unknown error",
				);
			} finally {
				setConnecting(false);
			}
		},
		[dispatch],
	);

	return { connecting, connectError, connectStore };
};
