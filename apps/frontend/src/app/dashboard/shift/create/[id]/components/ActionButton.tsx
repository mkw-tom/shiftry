"use client";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { TEST_MODE } from "@/lib/env";
import type { RequestShiftMessageType } from "@shared/api/webhook/line/validatioins";
import next from "next";
import { useRouter } from "next/navigation";
import React from "react";
import { useBulkUpsertJobroles } from "../api/bulk-upsert-jobrole/hook";
import { useBulkUpsertShiftPositions } from "../api/bulk-upsert-shift-positions/hook";
import { useSendShiftReqeust } from "../api/send-shift-request-line/hook";
import { useUpsertShiftReqeust } from "../api/upsert-shift-request/hook";
import { useCreateRequest } from "../context/CreateRequestFormProvider";
import useActionButton from "../hook/useActionButton";
import { buildRequestsFromPositions } from "../utils/generateRequests";

const ActionButton = () => {
	const router = useRouter();
	const {
		step,
		nextStep,
		prevStep,
		formData,
		setFormData,
		shiftPositioins,
		allJobRoles,
	} = useCreateRequest();

	const { gotoAdjustPage } = useActionButton({
		formData,
		setFormData,
		shiftPositioins,
		nextStep,
		allJobRoles,
	});

	const selectDateDisabled =
		!formData.weekStart || !formData.weekEnd || !formData.deadline;
	const registerPositionDisabled = shiftPositioins.length === 0;

	if (step === "select_date") {
		return (
			<div className="absolute bottom-5 left-0 right-0 w-full mx-auto flex justify-center bg-base  px-3 pb-5 pt-3">
				<button
					type="button"
					className="btn w-full bg-green02 text-white border-none"
					onClick={() => nextStep()}
					disabled={selectDateDisabled}
				>
					次へ
				</button>
			</div>
		);
	}

	if (step === "regist_position") {
		return (
			<div className="absolute bottom-5 left-0 right-0 w-full mx-auto flex justify-between gap-1 bg-base  px-3 pb-5 pt-3">
				<button
					type="button"
					className="btn w-1/3 bg-gray02 text-white border-none"
					onClick={prevStep}
				>
					戻る
				</button>
				<button
					type="button"
					className="btn w-2/3 bg-green02 text-white border-none"
					onClick={gotoAdjustPage}
					disabled={registerPositionDisabled}
				>
					次へ
				</button>
			</div>
		);
	}
};

export default ActionButton;
