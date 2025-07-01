import { useMembersHook } from "@/app/features/common/api/get-members/hook";
import type { RootState } from "@/app/redux/store";
import type { shiftsOfSubmittedType } from "@shared/common/types/json";
import type { SubmittedShift, User } from "@shared/common/types/prisma";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetSubmittedShiftsSpecific } from "../../../api/get-shift-submit-specific/hook";
import { useBottomDrawer } from "../../../context/useBottomDrawer";
import { useGenareteShift } from "../../../context/useGenerateShift";
import ActionButton from "./ActionButton";
import GenerateShiftButton from "./GenareteShiftButton";
import NotSubmitShiftList from "./NotSubmitShiftList";
import OwnerRequestsForm from "./OwnerRequestsForm";
import PreviewSubmitsForm from "./PreviewSubmitsForm";
import StatusHeadSwitch from "./StatusHeadSwitch";
import StepBar from "./StepBar";
import SubmittedShiftList from "./SubmittedShiftLIst";

export type SubmittedShiftWithJson = Omit<SubmittedShift, "shifts"> & {
	shifts: shiftsOfSubmittedType;
};

export type SubmitStatusDataType = {
	submittedShifts: SubmittedShiftWithJson[];
	notSubmittedShifts: User[];
};

const Status = () => {
	const { step } = useGenareteShift();
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
