import React, { useEffect } from "react";
import { useGenareteShift } from "../../../context/useGenerateShift";
import ActionButton from "./ActionButton";
import OwnerRequestsForm from "./OwnerRequestsForm";
import PreviewSubmitsForm from "./PreviewSubmitsForm";
import StepBar from "./StepBar";

const Status = () => {
	const { step } = useGenareteShift();
	useEffect(() => {}, []);
	return (
		<div>
			<StepBar />
			{step === "PREVIEW_SUBMITS" && <PreviewSubmitsForm />}
			{step === "INPUT_REQUESTS" && <OwnerRequestsForm />}
			<ActionButton />
		</div>
	);
};

export default Status;
