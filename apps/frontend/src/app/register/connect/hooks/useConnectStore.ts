"use client";
import { setStore } from "@/app/redux/slices/store";
import liff from "@line/liff";
import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { postConnectLineGroup } from "../api/connectLineGroup";
import { useParamGroupId } from "./useParamGroupId";

export const useConnectStore = () => {
	const [connecting, setConnecting] = useState(false);
	const [connectError, setConnectError] = useState<string | null>(null);
	const dispatch = useDispatch();
	const groupId = useParamGroupId();

	const connectStore = useCallback(
		async (storeCode: string) => {
			setConnecting(true);
			setConnectError(null);

			try {
				const idToken = liff.getIDToken();
				if (!idToken) throw new Error("ID Token not found");
				if (!groupId) throw new Error("Group ID not found");

				const response = await postConnectLineGroup(
					idToken,
					groupId,
					storeCode,
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
			} catch (e) {
				const msg =
					e instanceof Error ? e.message : "不明なエラーが発生しました";
				setConnectError(msg);
			} finally {
				setConnecting(false);
			}
		},
		[dispatch, groupId],
	);

	return { connecting, connectError, connectStore };
};
