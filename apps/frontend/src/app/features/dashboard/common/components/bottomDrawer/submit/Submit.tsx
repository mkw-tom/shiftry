"use client";
import type { RootState } from "@/app/redux/store";
import type { shiftsOfSubmittedType } from "@shared/api/common/types/json";
import { ShiftStatus } from "@shared/api/common/types/prisma";
import type { UpsertSubmittedShiftInputType } from "@shared/api/shift/submit/validations/put";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetSubmittedShiftUserOne } from "../../../api/get-shift-submit-one/hook";
import { useUpsertSubmitShift } from "../../../api/upsert-shift-submit/hook";
import { useBottomDrawer } from "../../../context/useBottomDrawer";
import SaveDataLoading from "../create-request/SaveDataLoading";
import AvailableWeeksForm from "./AvailableWeeksForm";
import SpecificDatesForm from "./SpecificDatesForm";
import SubmitButton from "./SubmitButton";
import WeekCountForm from "./WeekCountForm";

export type DayOfWeekType =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

const Submit = () => {
	const { currentData, drawerClose } = useBottomDrawer();
	const { userToken, storeToken } = useSelector(
		(state: RootState) => state.token,
	);
	const { user } = useSelector((state: RootState) => state.user);

	const [reSubmit, setReSubmit] = useState(false);

	const { handleGetSubmitShiftUserOne, isLoading: getDataLoading } =
		useGetSubmittedShiftUserOne();
	const { handleUpsertSubmitShift, isLoading: submitDataLoading } =
		useUpsertSubmitShift();

	const createInitialFormData = (
		shiftRequestId: string,
		userName = "",
	): UpsertSubmittedShiftInputType => ({
		name: userName,
		startDate: "",
		endDate: "",
		shiftRequestId,
		status: ShiftStatus.ADJUSTMENT,
		shifts: {
			weekCountMax: 0,
			weekCountMin: 0,
			availableWeeks: [],
			specificDates: [],
		},
	});

	const [formData, setFormData] = useState<UpsertSubmittedShiftInputType>(() =>
		createInitialFormData(currentData?.id ?? "", user?.name ?? ""),
	);

	useEffect(() => {
		const fetchData = async () => {
			if (!userToken || !storeToken || !currentData?.id) return;

			const res = await handleGetSubmitShiftUserOne({
				userToken,
				storeToken,
				shiftRequestId: currentData.id,
			});

			if (res?.ok && res.submittedShift !== null) {
				setFormData({
					name: user?.name as string,
					startDate: String(currentData.weekStart),
					endDate: String(currentData.weekEnd),
					shiftRequestId: res.submittedShift.shiftRequestId,
					status: res.submittedShift.status,
					shifts: res.submittedShift.shifts as shiftsOfSubmittedType,
				});
				setReSubmit(true);
			}
		};

		fetchData();
	}, [
		userToken,
		storeToken,
		currentData,
		user?.name,
		handleGetSubmitShiftUserOne,
	]);

	const saveSubmitShift = async () => {
		if (!userToken || !storeToken) {
			throw new Error("トークン情報がありません");
		}

		await handleUpsertSubmitShift({ userToken, storeToken, formData });

		drawerClose();
		setFormData(createInitialFormData(currentData?.id ?? "", user?.name ?? ""));
	};

	const isSubmitDisabled =
		formData.shifts.weekCountMin === 0 ||
		formData.shifts.weekCountMax === 0 ||
		formData.shifts.availableWeeks.length === 0;

	return (
		<div className="">
			{getDataLoading && <SaveDataLoading />}
			<div className="h-[450px] pb-56 overflow-y-auto">
				<div className="flex gap-1 flex-col px-2 pt-4">
					<WeekCountForm formData={formData} setFormData={setFormData} />
					<AvailableWeeksForm formData={formData} setFormData={setFormData} />
					<SpecificDatesForm formData={formData} setFormData={setFormData} />
				</div>
			</div>
			<SubmitButton
				isSubmitDisabled={isSubmitDisabled}
				saveSubmitShift={saveSubmitShift}
				submitDataLoading={submitDataLoading}
				reSubmit={reSubmit}
			/>
		</div>
	);
};

export default Submit;
