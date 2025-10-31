"use client";
import React, { useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import TimeSelecter from "@/app/dashboard/common/components/TimeSelecter";
import { MDW } from "@shared/utils/formatDate";
import { BiCalendar } from "react-icons/bi";
import { FcCancel } from "react-icons/fc";
import { MdCalendarToday } from "react-icons/md";
import { useSubmitShiftForm } from "../context/SubmitShiftFormContextProvider";
import ShiftTable from "./ShiftTable";
import SubmitButton from "./SubmitButton";
import SubmitSelectModal from "./SubmitSelectModal";
import WeekMinMaxInput from "./WeekMinMaxInput";

type ShiftValue = string | null;

const pad2 = (n: number) => String(n).padStart(2, "0");
const toHHmm = (d: Date | null) =>
	d ? `${pad2(d.getHours())}:${pad2(d.getMinutes())}` : "";
const parseHHmm = (s?: string) => {
	if (!s || !/^\d{2}:\d{2}$/.test(s)) return null;
	const [hh, mm] = s.split(":").map(Number);
	const d = new Date();
	d.setHours(hh, mm, 0, 0);
	return d;
};
const isRange = (v?: ShiftValue) => !!v && v.includes("-");

const SubmitForm = () => {
	const { formData, setFormData, shiftRequestData } = useSubmitShiftForm();

	if (!shiftRequestData || !shiftRequestData.requests) {
		return (
			<div className="text-center text-sm text-gray-500 mt-6">
				データ読込中…
			</div>
		);
	}

	const [modalOpen, setModalOpen] = useState(false);
	const [modalTargetDate, setModalTargetDate] = useState<string | null>(null);

	const [startTime, setStartTime] = useState<string>("");
	const [endTime, setEndTime] = useState<string>("");
	const [currentOption, setCurrentOption] = useState<
		"none" | "anytime" | "time"
	>("anytime");

	const openModal = (date: string) => {
		setModalTargetDate(date);
		setModalOpen(true);
		// 既にレンジがあれば初期値に復元
		const v = formData.shifts[date];
		if (isRange(v)) {
			const [s, e] = (v as string).split("-");
			setStartTime(/^\d{2}:\d{2}$/.test(s) ? s : "09:00");
			setEndTime(/^\d{2}:\d{2}$/.test(e) ? e : "13:00");
			setCurrentOption("time");
		} else if (v === "anytime") {
			setCurrentOption("anytime");
			setStartTime("09:00");
			setEndTime("13:00");
		} else {
			setCurrentOption("none");
			setStartTime("09:00");
			setEndTime("13:00");
		}
	};

	const closeModal = () => {
		setModalOpen(false);
		setModalTargetDate(null);
		setStartTime("09:00");
		setEndTime("13:00");
		setCurrentOption("anytime");
	};

	return (
		<div className="w-full max-w-[380px] mx-auto mt-2 px-1 flex flex-col">
			<div className="w-full flex justify-between items-center py-2 px-1">
				<h1 className="text-start text-sm font-bold border-green02 text-green02 flex items-center gap-2">
					<BiCalendar className="text-lg" />
					{MDW(shiftRequestData.weekStart)} ~ {MDW(shiftRequestData.weekEnd)}
				</h1>
				<h2 className="text-xs text-error">
					提出期限：{MDW(shiftRequestData.deadline as Date)}
				</h2>
			</div>

			<ShiftTable openModal={openModal} />

			{modalOpen && modalTargetDate && (
				<SubmitSelectModal
					modalTargetDate={modalTargetDate}
					closeModal={closeModal}
					startTime={startTime}
					endTime={endTime}
					currentOption={currentOption}
					setStartTime={setStartTime}
					setEndTime={setEndTime}
					setCurrentOption={setCurrentOption}
				/>
			)}
			<WeekMinMaxInput />

			<SubmitButton />
		</div>
	);
};

export default SubmitForm;
