"use client";
import React from "react";
import { useCreateRequest } from "../context/CreateRequestFormProvider";
import ActionButton from "./ActionButton";
import { RangeCalendar } from "./RangeCalendar";
import AdjustPositionForm from "./adjustCalenderForm/AdjustForm";
import RegistPositionForm from "./registerPositionForm/RegistPositionForm";

const CreateReqeustForm = () => {
	const { step } = useCreateRequest();

	return (
		<div className="w-full h-full">
			{step === "select_date" && <RangeCalendar />}
			{step === "regist_position" && <RegistPositionForm />}
			{step === "adjust_position" && <AdjustPositionForm />}
			<ActionButton />
		</div>
	);
};

export default CreateReqeustForm;
