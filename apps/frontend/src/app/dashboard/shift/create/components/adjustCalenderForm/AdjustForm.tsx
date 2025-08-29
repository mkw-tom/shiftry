import type { RequestPositionWithDateInput } from "@shared/api/shift/request/validations/put";
import { MD, MDW } from "@shared/utils/formatDate";
import { convertDateToWeekByJapanese } from "@shared/utils/formatWeek";
import { useState } from "react";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { LuUserRound } from "react-icons/lu";
import { MdAdd } from "react-icons/md";
import { useCreateRequest } from "../../context/CreateRequestFormProvider";
// import type { AdjustPositionFormType } from "../../hook/form/useAdjustPositoinForm";
import PriorityAndAbsoluteModal from "../shared/PriorityAndAbsoluteModal";
import AdjustPositionModal from "./AdjustModal";
import CalenderTable from "./CalenderTable";
import PositionList from "./PositionList";

const AdjustPositionForm = () => {
	const { formData } = useCreateRequest();
	const [editCalendarPositon, setEditCalendarPositon] =
		useState<RequestPositionWithDateInput>({
			name: "",
			startTime: "",
			endTime: "",
			count: 1,
			jobRoles: [],
			absolute: [],
			priority: [],
		});
	// const [editTime, setEditTime] = useState<string>("");

	const openAdjustCalenerPositionModal = (
		position: RequestPositionWithDateInput,
		date: string,
		// time: string | "00:00-00:00"
	) => {
		const modal = document.getElementById(`${date}-${position.name}`);
		if (modal) {
			(modal as HTMLDialogElement).showModal();
		}
		setEditCalendarPositon({
			name: position.name,
			startTime: position.startTime,
			endTime: position.endTime,
			count: position.count || 1,
			jobRoles: position.jobRoles || [],
			absolute: position.absolute || [],
			priority: position.priority || [],
		});
		// setEditTime(time);
	};

	const dateFullRange = (): Date[] => {
		const start = new Date(formData.weekStart);
		const end = new Date(formData.weekEnd);
		const dates: Date[] = [];
		if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
			return dates;
		const current = new Date(start);
		while (current <= end) {
			dates.push(new Date(current)); // コピーを入れる
			current.setDate(current.getDate() + 1);
		}
		return dates;
	};

	const [daysSplitIndex, setDaysSplitIndex] = useState<number>(0);
	const daysWithSevenDays = dateFullRange().slice(
		daysSplitIndex * 7,
		7 * (daysSplitIndex + 1),
	);
	const [selectDate, setSelectDate] = useState<Date>(daysWithSevenDays[0]);

	return (
		<div className="w-full flex flex-col">
			<CalenderTable
				dateFullRange={dateFullRange}
				daysSplitIndex={daysSplitIndex}
				setDaysSplitIndex={setDaysSplitIndex}
				daysWithSevenDays={daysWithSevenDays}
				selectDate={selectDate}
				setSelectDate={setSelectDate}
			/>
			<AdjustPositionModal
				date={String(selectDate)}
				time={""}
				editCalenderrPositon={editCalendarPositon}
				setEditCalendarPosition={setEditCalendarPositon}
				mode="new"
				// editTime={editTime}
				// setEditTime={setEditTime}
			/>
			<div className="w-full flex flex-col gap-1 items-center justify-center shadow-sm  p-1 bg-white">
				<button
					type="button"
					className="btn btn-sm bg-white text-green01 font-bold w-full border-dashed border-1 border-gray01 shadow-none"
					onClick={() =>
						openAdjustCalenerPositionModal(
							editCalendarPositon,
							String(selectDate),
						)
					}
				>
					<MdAdd className="text-lg" />
					ポジションを追加
				</button>
			</div>
			<PositionList
				selectDate={selectDate}
				openAdjustCalenerPositionModal={openAdjustCalenerPositionModal}
				editCalendarPositon={editCalendarPositon}
				setEditCalendarPositon={setEditCalendarPositon}
				// editTime={editTime}
				// setEditTime={setEditTime}
			/>
		</div>
	);
};

export default AdjustPositionForm;
