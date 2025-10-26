"use client";
import React, { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiCalendar } from "react-icons/bi";
import { FcCancel } from "react-icons/fc";
import { MdCalendarToday } from "react-icons/md";

import { time } from "node:console";
import TimeSelecter from "@/app/dashboard/common/components/TimeSelecter";
import { MDW } from "@shared/utils/formatDate";
import { useSubmitShiftForm } from "../context/SubmitShiftFormContextProvider";
import SubmitButton from "./SubmitButton";

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

	const allDates = useMemo(
		() => Object.keys(shiftRequestData.requests),
		[shiftRequestData],
	);
	const weekDayLabels = ["日", "月", "火", "水", "木", "金", "土"];

	const dateList = useMemo(() => {
		return allDates.map((dateStr) => {
			const d = new Date(dateStr);
			const label = Number.isNaN(d.getTime()) ? "?" : weekDayLabels[d.getDay()];
			const slots = shiftRequestData.requests[dateStr]; // その日のタイムスロット
			const isHoliday = !slots || Object.keys(slots).length === 0; // 空 or undefined を休日扱い
			return { date: dateStr, label, isHoliday };
		});
	}, [allDates, shiftRequestData]);

	// 1週間ずつページング
	const pageSize = 7;
	const weeks = useMemo(() => {
		const chunks: (typeof dateList)[] = [];
		for (let i = 0; i < dateList.length; i += pageSize) {
			chunks.push(dateList.slice(i, i + pageSize));
		}
		return chunks;
	}, [dateList]);

	// ヘッダーは1週目の並びをそのまま使う（安定キー: 各セルの日付）
	const headerWeek = weeks[0] ?? [];

	const holidayDates = useMemo(
		() => dateList.filter((d) => d.isHoliday).map((d) => d.date),
		[dateList],
	);

	// モーダル操作
	const [modalOpen, setModalOpen] = useState(false);
	const [modalTargetDate, setModalTargetDate] = useState<string | null>(null);
	// 時間指定はstart/endで個別管理
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

	const setShiftForDate = (date: string, value: ShiftValue) => {
		setFormData((prev) => ({
			...prev,
			shifts: { ...prev.shifts, [date]: value },
		}));
	};

	const handleTimeConfirm = () => {
		if (!modalTargetDate || !startTime || !endTime) return;
		if (startTime >= endTime) {
			alert("終了時刻は開始時刻より後にしてください");
			return;
		}
		setShiftForDate(modalTargetDate, `${startTime}-${endTime}`);
	};

	const handleSaveSelectModal = () => {
		if (!modalTargetDate) return;
		if (currentOption === "time") {
			handleTimeConfirm();
			closeModal();
			return;
		}
		if (currentOption === "anytime") {
			setShiftForDate(modalTargetDate, "anytime");
			closeModal();
			return;
		}
		if (currentOption === "none") {
			setShiftForDate(modalTargetDate, null);
			closeModal();
			return;
		}
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

			{/* 曜日ラベル（安定キー: 1週目の日付） */}
			<table className="w-full border-collapse text-[11px]">
				<thead>
					<tr>
						{headerWeek.map((item) => (
							<th
								key={`head-${item.date}`}
								className="border border-gray01 p-1 text-center bg-gray-100 whitespace-nowrap text-gray-600"
							>
								<div className="text-[11px] font-bold leading-tight">
									{item.label}
								</div>
							</th>
						))}
					</tr>
				</thead>
			</table>

			{/* 週ごとのテーブル */}
			<div>
				{weeks.map((week) => {
					const weekKey =
						week[0]?.date ?? `wk-${Math.random().toString(36).slice(2)}`;
					// パディング用の安定キー（週のキーに連番を付与）
					const padCount = Math.max(0, 7 - week.length);
					const padKeys = Array.from({ length: padCount }).map(
						(_, i) => `${weekKey}-pad-${i}`,
					);

					return (
						<div key={`week-${weekKey}`}>
							<table className="w-full border-collapse text-[11px] mb-2">
								<tbody>
									<tr>
										{week.map((item) => {
											const targetValue = formData.shifts[item.date];

											return (
												<td
													key={item.date}
													className="border border-gray01 h-16 w-[calc(100%/7)] text-center align-top relative"
												>
													<div className="flex flex-col items-center justify-center h-full">
														<span className="text-[11px] h-2/5 text-gray-600 font-bold pt-1">
															{item.date.slice(5)}
														</span>

														{holidayDates.includes(item.date) ? (
															<span className="w-full h-3/5 text-[11px] flex items-center justify-center bg-gray01 text-gray-600">
																定休日
															</span>
														) : (
															<button
																type="button"
																className={`w-full h-3/5 text-[11px] ${
																	targetValue === null
																		? "bg-red-50"
																		: targetValue?.includes("-")
																			? "bg-green03"
																			: "bg-white"
																} hover:bg-green-50 transition-colors duration-150 flex items-center justify-center text-gray-600`}
																style={{ minWidth: "48px", maxWidth: "100%" }}
																onClick={() => openModal(item.date)}
															>
																{targetValue === null && (
																	<FcCancel className="text-lg" />
																)}

																{targetValue?.includes("-")
																	? (() => {
																			const [s, e] = targetValue.split("-");
																			return (
																				<span className="flex flex-col items-center justify-center w-full text-gray-600">
																					<span className="leading-tight">
																						{s}
																					</span>
																					<span className="leading-tight">
																						{e}
																					</span>
																				</span>
																			);
																		})()
																	: null}

																{targetValue === "anytime" && "選択"}
															</button>
														)}
													</div>
												</td>
											);
										})}

										{/* 週が7日未満の場合は空セルで埋める（安定キー使用） */}
										{padKeys.map((k) => (
											<td
												key={k}
												className="border border-gray01 h-16 w-7 text-center"
											/>
										))}
									</tr>
								</tbody>
							</table>
						</div>
					);
				})}
			</div>

			{/* モーダル */}
			{modalOpen && modalTargetDate && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="modal modal-open">
						<div
							className={`modal-box p-4 bg-white ${
								currentOption === "time" ? "overflow-visible" : "h-auto"
							}`}
						>
							<p className="mb-4 text-green02 font-bold flex items-center gap-2">
								<MdCalendarToday />
								<span>{modalTargetDate}</span>
								<button
									type="button"
									className="btn btn-link btn-xs text-gray02 ml-auto"
									onClick={closeModal}
								>
									キャンセル
								</button>
							</p>

							{/* options（ボタン） */}
							<div className="flex flex-col gap-2 w-full">
								<select
									className="select select-sm select-bordered bg-base text-gray-800 focus:outline-none w-full text-center"
									value={currentOption}
									onChange={(e) => {
										const v = e.target.value as "none" | "anytime" | "time";
										setCurrentOption(v);
									}}
								>
									<option value="none">休み</option>
									<option value="anytime">終日</option>
									<option value="time">時間指定</option>
								</select>
							</div>

							{/* 時間指定 UI */}
							{currentOption === "time" && (
								<div className="flex gap-1 items-center mt-2 w-full ">
									<TimeSelecter
										value={startTime}
										onChange={(newStart) => setStartTime(newStart || "09:00")}
										step={30}
										start="00:00"
										end="23:30"
										btnStyle="btn-sm bg-base w-34"
										color="success"
									/>
									<span className="text-center mx-1 flex-1">~</span>
									<TimeSelecter
										value={endTime}
										onChange={(newEnd) => setEndTime(newEnd || "13:00")}
										step={30}
										start="00:00"
										end="23:30"
										btnStyle="btn-sm bg-base w-34"
										color="success"
									/>
								</div>
							)}
							<button
								type="button"
								className="w-full btn btn-sm btn-success mt-5"
								onClick={handleSaveSelectModal}
							>
								保存
							</button>
						</div>
					</div>
				</div>
			)}

			<SubmitButton />
		</div>
	);
};

export default SubmitForm;
