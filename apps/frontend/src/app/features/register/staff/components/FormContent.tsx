import React from "react";
import { useStaffRegisterStep } from "../context/useStaffRegisterStep";
import StaffLineAuthForm from "./StaffLineAuthForm";
import StaffRegistForm from "./StaffRegistForm";
import SuccessRegistForm from "./SuccessRegistForm";

const FormContent = () => {
	const { step, stepLoading } = useStaffRegisterStep();

	if (stepLoading) {
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
			{step === "LINE_AUTH" && <StaffLineAuthForm />}
			{step === "REGIST" && <StaffRegistForm />}
			{step === "SUCCESS_REGIST" && <SuccessRegistForm />}
		</div>
	);
};

export default FormContent;
