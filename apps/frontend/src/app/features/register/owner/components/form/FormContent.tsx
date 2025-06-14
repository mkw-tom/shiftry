"use clinet";
import React from "react";
import { useRegisterLoadingUI } from "../../../common/context/useRegisterLoadingUI";
import {
	RegisterStep,
	useRegisterSteps,
} from "../../context/UseRegisterStepContext";
import InviteBotForm from "./InviteBotForm";
import LineAuthForm from "./LineAuthForm";
import RegisterForm from "./RegisterForm";

const FormContent = () => {
	const { step } = useRegisterSteps();
	const { pageLoading } = useRegisterLoadingUI();
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
			{step === RegisterStep.Auth && <LineAuthForm />}
			{step === RegisterStep.Register && <RegisterForm />}
			{step === RegisterStep.InviteBot && <InviteBotForm />}
		</div>
	);
};

export default FormContent;
