"use client";
import React from "react";
import { useRegisterLoadingUI } from "../../common/context/useRegisterLoadingUI";
import { useConnectSteps } from "../context/useConnectStep";
import { useGroupToken } from "../hooks/useGroupToken";
import ConnectModal from "./ConnectModal";
import SuccessConnectModal from "./SuccessConnectModal";

const ConnectModalContent = () => {
	useGroupToken();
	const { pageLoading } = useRegisterLoadingUI();
	const { step } = useConnectSteps();

	if (pageLoading) {
		return (
			<div className="w-full ">
				<div className=" w-full h-32 flex flex-col justify-center items-center gap-2">
					<span className="loading loading-spinner text-success" />
					<span className="text-xs text-success font-bold">読み込み中…</span>
				</div>
			</div>
		);
	}
	return (
		<div className="flex flex-col gap-5 mt-5">
			{step === 0 && <ConnectModal />}
			{step === 1 && <SuccessConnectModal />}
		</div>
	);
};

export default ConnectModalContent;
