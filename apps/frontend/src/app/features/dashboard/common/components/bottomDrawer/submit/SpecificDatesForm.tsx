import { MDW } from "@/app/features/common/hooks/useFormatDate";
import type { UpsertSubmittedShiftInputType } from "@shared/shift/submit/validations/put";
import React, { type Dispatch, type SetStateAction, useState } from "react";
import { MdOutlineHolidayVillage } from "react-icons/md";
import { RiTimeLine } from "react-icons/ri";
import AddSpecificDatesModal from "./AddSpecificDatesModal";

const SpecificDatesForm = ({
	formData,
	setFormData,
}: {
	formData: UpsertSubmittedShiftInputType;
	setFormData: Dispatch<SetStateAction<UpsertSubmittedShiftInputType>>;
}) => {
	const parseSpecificDateTime = (data: string) => {
		const [date, timeRange] = data.split("&");
		if (timeRange === undefined) {
			return { date: date };
		}
		const [start, end] = timeRange.split("-");
		return {
			date: date,
			startTime: start.trim(),
			endTime: end.trim(),
		};
	};

	const addSpecificDateToForm = (
		inputSpecificDate: {
			date: string;
			off: boolean;
			timePick: boolean;
		},
		inputTimeValues: {
			startTime: string;
			endTime: string;
		},
	) => {
		const { date, off, timePick } = inputSpecificDate;
		const { startTime, endTime } = inputTimeValues;

		let formattedDate = "";

		if (off) {
			formattedDate = date; // 完全休み
		} else if (timePick && startTime && endTime) {
			formattedDate = `${date}&${startTime}-${endTime}`; // 時間指定あり
		} else {
			console.warn("invalid specific date input");
			return;
		}

		setFormData((prev) => ({
			...prev,
			shifts: {
				...prev.shifts,
				specificDates: [...prev.shifts.specificDates, formattedDate],
			},
		}));
	};

	const removeSpecificDateEntry = (target: string) => {
		if (!confirm("この希望日を削除しますか？")) return;

		setFormData((prev) => ({
			...prev,
			shifts: {
				...prev.shifts,
				specificDates: prev.shifts.specificDates.filter((d) => d !== target),
			},
		}));
	};

	return (
		<div className=" text-black  w-full flex flex-col mt-5">
			<div className="flex items-center gap-10">
				{/* Open the modal using document.getElementById('ID').showModal() method */}
				<div className="flex items-center gap-5">
					<span className="text-md font-thin opacity-70 tabular-nums text-black ">
						③ 特定日の希望
					</span>
					<AddSpecificDatesModal
						addSpecificDateToForm={addSpecificDateToForm}
					/>
				</div>
			</div>
			<ul className="pt-2 flex flex-col gap-2">
				{formData.shifts.specificDates.map((data, idx) => (
					<li
						key={data}
						className="flex items-center gap-2 border-b-1 border-b-gray01 p-2"
					>
						<h2 className="">{MDW(new Date(data))}</h2>
						{parseSpecificDateTime(data).startTime !== undefined ? (
							<div className="flex items-center gap-1">
								<RiTimeLine className="text-black opacity-70" />
								<span className="text-black opacity-70">
									{parseSpecificDateTime(data).startTime} -{" "}
									{parseSpecificDateTime(data).endTime}
								</span>
							</div>
						) : (
							<div className="flex items-center gap-1">
								<MdOutlineHolidayVillage className="text-black opacity-70" />
								<span className="text-black opacity-70">休み</span>
							</div>
						)}
						<button
							type="button"
							className="text-white btn btn-sm btn-error shadow-none border-none rounded-full ml-auto"
							onClick={() => removeSpecificDateEntry(data)}
						>
							削除
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default SpecificDatesForm;
