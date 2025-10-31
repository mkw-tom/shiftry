"use client";
import { useGetShiftRequestSpecific } from "@/app/api/hook/useGetShiftRequestSpecific";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import React, { useEffect } from "react";
import { useCreateRequest } from "../context/CreateRequestFormProvider";
import ActionButton from "./ActionButton";
import { RangeCalendar } from "./RangeCalendar";
import RegistPositionForm from "./registerPositionForm/RegistPositionForm";

const CreateReqeustForm = ({ shiftRequestId }: { shiftRequestId: string }) => {
	const { step, setFormData } = useCreateRequest();
	const { getShiftRequestSpecific } = useGetShiftRequestSpecific();
	const { showToast } = useToast();

	useEffect(() => {
		const fetchData = async () => {
			if (shiftRequestId === "new") return;

			if (shiftRequestId) {
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
			<ActionButton />
		</div>
	);
};

export default CreateReqeustForm;
