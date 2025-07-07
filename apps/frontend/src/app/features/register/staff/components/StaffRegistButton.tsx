import type { RootState } from "@/app/redux/store";
import { userInputType } from "@shared/api/auth/validations/register-staff";
import React from "react";
import type { FieldError } from "react-hook-form";
import { useSelector } from "react-redux";
import { useStaffRegisterStep } from "../context/useStaffRegisterStep";

const StaffRegistButton = ({
	name,
	isDisabled,
}: {
	name: string;
	isDisabled: boolean | FieldError;
}) => {
	const { stepLoading, changeStep } = useStaffRegisterStep();
	const { user } = useSelector((state: RootState) => state.user);

	// const userInput = {
	//   name: name,
	//   role: user?.role,
	//   pictureUrl: user?.pictureUrl,
	// } as userInputType;

	return (
		<button
			type="button"
			className="btn btn-sm sm:btn-md  bg-green02  rounded-full border-none w-2/3  mx-auto text-white"
			onClick={() => changeStep(name)}
			disabled={!!isDisabled}
		>
			{!stepLoading ? (
				<div className="flex items-center gap-2">登録</div>
			) : (
				<span className="loading loading-dots" />
			)}
		</button>
	);
};

export default StaffRegistButton;
