"use client";
import React from "react";
import { useCreateRequest } from "../context/useCreateRequest";
import ActionButton from "./ActionButton";
import AdjustPositionForm from "./AdjustPositionForm";
import { RangeCalendar } from "./RangeCalendar";
import RegistPositionForm from "./RegistPositionForm";

const CreateReqeustForm = () => {
	const { step } = useCreateRequest();

	return (
		<div className="w-full h-full">
			{step === "select_date" && <RangeCalendar />}
			{step === "regist_position" && <RegistPositionForm />}
			{step === "adjust_position" && <AdjustPositionForm />}
			{step === "preview" && <div className="text-black">プレビュー確認</div>}
			<ActionButton />
		</div>
	);
};

export default CreateReqeustForm;
