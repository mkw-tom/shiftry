"use client";
import { setStore } from "@/app/redux/slices/store";
import liff from "@line/liff";
import type { ErrorResponse } from "@shared/api/common/types/errors";
import type { StoreConnectLineGroupResponse } from "@shared/api/store/types/connect-line-group";
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
		async (
			storeCode: string,
		): Promise<StoreConnectLineGroupResponse | ErrorResponse> => {
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
					return { ok: false, message: response.message };
				}

				dispatch(setStore(response.store));
				return response;
			} catch (e) {
				const msg =
					e instanceof Error ? e.message : "不明なエラーが発生しました";
				setConnectError(msg);
				return { ok: false, message: msg };
			} finally {
				setConnecting(false);
			}
		},
		[dispatch, groupId],
	);

	return { connecting, connectError, connectStore };
};
