"use client";
import type { ShiftsOfRequestsType } from "@shared/common/types/json";
import React, { useEffect } from "react";
import { useUpsertShiftReqeust } from "../../../api/upsert-shift-request/hook";
import { DrawerView, useBottomDrawer } from "../../../context/useBottomDrawer";
import {
	CreateRequestStep,
	formDataInit,
	useCreateRequest,
} from "../../../context/useCreateRequest";
import PeriodForm from "./PeriodForm";
import SaveDataLoading from "./SaveDataLoading";
import SpecialShiftForm from "./SpecialShiftForm";
import WeekShiftForm from "./WeekShiftForm";

export const formatInputDate = (date: Date | string) => {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
};

export const formatInputDateTime = (date: Date | string) => {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
};

const CreateRequest = () => {
	const { step, setStep, setFormData, formData } = useCreateRequest();
	const { error, isLoading } = useUpsertShiftReqeust();
	const { currentData, view } = useBottomDrawer();
	const now = new Date();
	const today = now.toISOString().split("T")[0];
	const nowDateTime = now.toISOString().slice(0, 16);

	useEffect(() => {
		if (currentData === null) {
			setFormData(formDataInit);
			return;
		}
		if (currentData && view === DrawerView.CREATE_REQUEST) {
			setFormData({
				weekStart: formatInputDate(currentData.weekStart),
				weekEnd: formatInputDate(currentData.weekEnd as Date),
				deadline: formatInputDateTime(currentData.deadline as Date),
				type: currentData.type,
				status: currentData.status,
				requests: currentData.requests as ShiftsOfRequestsType,
			});
			return;
		}
	}, [currentData, view, setFormData]);

	return (
		<div className="">
			{isLoading && <SaveDataLoading />}
			<div className="breadcrumbs text-sm w-full text-green02 font-bold mx-auto ">
				<ul className="flex items-center gap-3">
					<li>
						<button type="button" className="">
							<span
								className={`${step === CreateRequestStep.Period ? "text-green02" : "text-green01"}`}
							>
								1. 期間指定
							</span>
						</button>
					</li>

					<li>
						<button type="button" className="text-green02">
							<span
								className={`${step === CreateRequestStep.Weekly ? "text-green02" : "text-green01"}`}
							>
								2. 曜日シフト
							</span>
						</button>
					</li>

					<li>
						<button type="button">
							<span
								className={`${step === CreateRequestStep.Special ? "text-green02" : "text-green01"}`}
							>
								3. 特別な日
							</span>
						</button>
					</li>
				</ul>
			</div>
			{step === CreateRequestStep.Period && <PeriodForm />}

			{step === CreateRequestStep.Weekly && <WeekShiftForm />}

			{step === CreateRequestStep.Special && <SpecialShiftForm />}
		</div>
	);
};

export default CreateRequest;
