"use client";
import liff from "@line/liff";
import { UserStoreLiteWithStore } from "@shared/api/common/types/prismaLite";
import { is } from "date-fns/locale";
import React from "react";
import { useAgreeCheckbox } from "../hooks/useAgreeCheckBox";
import { useConnectStore } from "../hooks/useConnectStore";
import ConnectButton from "./ConnectButton";

const ConnectForm = ({ storeId }: { storeId: string | null }) => {
	const { register, errors, isDisabled, handleSubmit } = useAgreeCheckbox();
	const { connectStore, connectError, connecting } = useConnectStore();
	const submitDisabled = !storeId || connecting || isDisabled;

	const onSubmit = async (data: { agree: boolean }) => {
		if (!data.agree) {
			return alert("同意にチェックを入れてください");
		}
		if (!storeId) {
			return alert("店舗が選択されていません。");
		}

		const res = await connectStore(storeId);
		if (!res?.ok) {
			alert(
				`店舗の接続に失敗しました。もう一度お試しください。n/n${connectError}`,
			);
			liff.closeWindow();
			return;
		}

		if (res?.ok) {
			alert(
				`LINEグループ連携が完了しました✨。n/n店舗名：${res.data.store.name}`,
			);
			liff.closeWindow();
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-5 mt-5 w-11/12 mx-auto"
		>
			<fieldset className="fieldset w-full mx-auto flex flex-col items-center">
				<label className="fieldset-label w-11/12 mx-auto">
					<input
						{...register("agree")}
						type="checkbox"
						defaultChecked={false}
						className="checkbox checkbox-sm checkbox-success mb-3 sm:mb-1"
						disabled={connecting}
					/>
					<span className="text-xs text-black ">
						サービス利用のため、LINEグループの情報取得に同意します。
					</span>
				</label>
				{errors.agree && (
					<p className="fieldset-label text-error">{errors?.agree?.message}</p>
				)}
			</fieldset>
			<ConnectButton isDisabled={submitDisabled} connecting={connecting} />
		</form>
	);
};

export default ConnectForm;
