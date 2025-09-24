"use client";
import { useGetShiftRequestSpecific } from "@/app/api/hook/useGetShiftRequestSpecific";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { dummyShiftRequest } from "@/app/utils/dummyData/ShiftRequest";
import { TEST_MODE } from "@/lib/env";
import { set } from "date-fns";
import React, { useEffect } from "react";
import { useCreateRequest } from "../context/CreateRequestFormProvider";
import ActionButton from "./ActionButton";
import { RangeCalendar } from "./RangeCalendar";
import AdjustPositionForm from "./adjustCalenderForm/AdjustForm";
import RegistPositionForm from "./registerPositionForm/RegistPositionForm";

const CreateReqeustForm = ({ shiftRequestId }: { shiftRequestId: string }) => {
	const { step, setFormData } = useCreateRequest();
	const { getShiftRequestSpecific } = useGetShiftRequestSpecific();
	const { showToast } = useToast();

	useEffect(() => {
		const fetchData = async () => {
			if (shiftRequestId === "new") return;

			if (shiftRequestId) {
				if (TEST_MODE) {
					setFormData((prev) => ({
						...prev,
						type: dummyShiftRequest.type,
						weekStart: dummyShiftRequest.weekStart
							? String(dummyShiftRequest.weekStart)
							: "",
						weekEnd: dummyShiftRequest.weekEnd
							? String(dummyShiftRequest.weekEnd)
							: "",
						deadline: dummyShiftRequest.deadline
							? String(dummyShiftRequest.deadline)
							: "",
						status: dummyShiftRequest.status,
						requests: dummyShiftRequest.requests,
					}));
					return;
				}
				const data = await getShiftRequestSpecific({
					shiftRequestId,
				});
				if (!data.ok) {
					showToast("シフトリクエストの取得に失敗しました", "error");
					return;
				}

				const shiftRequest = data.shiftRequest;
				setFormData((prev) => ({
					...prev,
					type: shiftRequest.type,
					weekStart: shiftRequest.weekStart
						? String(shiftRequest.weekStart)
						: "",
					weekEnd: shiftRequest.weekEnd ? String(shiftRequest.weekEnd) : "",
					deadline: shiftRequest.deadline ? String(shiftRequest.deadline) : "",
					status: shiftRequest.status,
					requests: shiftRequest.requests,
				}));
			}
		};
		fetchData();
	}, [shiftRequestId, getShiftRequestSpecific, setFormData, showToast]);

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
