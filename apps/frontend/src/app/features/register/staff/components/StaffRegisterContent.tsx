"use client";
import { useAgreeCheckbox } from "@/app/features/common/hooks/useAgreeCheckBox";
import React from "react";
import { StaffRegisterStepProvider } from "../context/useStaffRegisterStep";
import FormContent from "./FormContent";
import LineAuthButton from "./LineAuthButton";

const StaffRegisterContent = () => {
	const { register, isDisabled, errors } = useAgreeCheckbox();

	return (
		<div className="flex justify-center mt-10 w-full">
			<div className="w-10/12 h-auto bg-white rounded-xl shadow-lg px-5 py-5">
				<h2 className="text-center font-bold text-sm text-black border-b-1 border-b-gray01 pb-1">
					スタッフ登録
				</h2>
				<StaffRegisterStepProvider>
					<FormContent />
				</StaffRegisterStepProvider>
			</div>
		</div>
	);
};

export default StaffRegisterContent;
