"use client";
import React, { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiCalendar } from "react-icons/bi";
import { FcCancel } from "react-icons/fc";
import { MdCalendarToday } from "react-icons/md";

import { MDW } from "@shared/utils/formatDate";
import { useSubmitShiftForm } from "../context/SubmitShiftFormContextProvider";
import SubmitButton from "./SubmitButton";

type ShiftValue = string | null;

const options = [
	{ value: "anytime", label: "指定なし" },
	{ value: "off", label: "休み" },
	{ value: "time", label: "時間指定" },
] as const;

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

	// 取得できていないときのガード
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
	const [timeStart, setTimeStart] = useState<Date | null>(null);
	const [timeEnd, setTimeEnd] = useState<Date | null>(null);
	const [timeMode, setTimeMode] = useState(false); // 時間指定モード

	const currentValue: ShiftValue = modalTargetDate
		? (formData.shifts[modalTargetDate] ?? "")
		: "";

	const openModal = (date: string) => {
		setModalTargetDate(date);
		setModalOpen(true);
		// 既にレンジがあれば初期値に復元
		const v = formData.shifts[date];
		if (isRange(v)) {
			const [s, e] = (v as string).split("-");
			setTimeStart(parseHHmm(s));
			setTimeEnd(parseHHmm(e));
			setTimeMode(true);
		} else {
			setTimeStart(null);
			setTimeEnd(null);
			setTimeMode(false);
		}
	};

	const closeModal = () => {
		setModalOpen(false);
		setModalTargetDate(null);
		setTimeStart(null);
		setTimeEnd(null);
		setTimeMode(false);
	};

	const setShiftForDate = (date: string, value: ShiftValue) => {
		setFormData((prev) => ({
			...prev,
			shifts: { ...prev.shifts, [date]: value },
		}));
	};

	const handleModalSelect = (value: (typeof options)[number]["value"]) => {
		if (!modalTargetDate) return;
		if (value === "off") {
			setShiftForDate(modalTargetDate, null); // 休み
			closeModal();
			return;
		}
		if (value === "time") {
			// 時間指定モードへ
			setTimeMode(true);
			if (!isRange(currentValue)) {
				setTimeStart(null);
				setTimeEnd(null);
			}
			return;
		}
		if (value === "anytime") {
			setShiftForDate(modalTargetDate, "anytime"); // 終日
			closeModal();
			return;
		}
	};

	const handleTimeConfirm = () => {
		if (!modalTargetDate || !timeStart || !timeEnd) return;

		const s = toHHmm(timeStart);
		const e = toHHmm(timeEnd);
		if (!s || !e) return;

		// 時間の整合（開始 < 終了）
		if (s >= e) {
			alert("終了時刻は開始時刻より後にしてください");
			return;
		}

		const value: ShiftValue = `${s}-${e}`;
		setShiftForDate(modalTargetDate, value);
		closeModal();
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
					<div className="modal modal-open modal-bottom">
						<div className="modal-box p-4 pb-12 bg-white">
							<div className="flex justify-between items-start">
								<h3 className="font-bold mb-2 text-lg text-gray02">
									希望を選択
								</h3>
								<button
									type="button"
									className="btn btn-link btn-xs text-gray02"
									onClick={closeModal}
								>
									キャンセル
								</button>
							</div>
							<p className="mb-4 text-green02 font-bold flex items-center gap-2">
								<MdCalendarToday />
								<span>{modalTargetDate}</span>
							</p>

							{/* options（ボタン） */}
							<div className="flex flex-col gap-2">
								{options.map((opt) => {
									const active =
										(opt.value === "off" && currentValue === null) ||
										(opt.value === "time" && timeMode) ||
										(opt.value === "anytime" && currentValue === "anytime");
									return (
										<button
											key={opt.value}
											type="button"
											className={`btn btn-sm w-full  ${active ? "btn-active bg-green02 text-white border-none shadow-md" : " bg-base shadow-md border-gray01 text-gray-600"}`}
											onClick={() => handleModalSelect(opt.value)}
										>
											{opt.label}
										</button>
									);
								})}
							</div>

							{/* 時間指定 UI */}
							{timeMode && (
								<div className="mt-4 flex flex-col gap-2">
									<div className="flex items-center gap-2">
										<span className="text-sm text-gray-600">開始</span>
										<DatePicker
											selected={timeStart}
											onChange={(d) => setTimeStart(d)}
											showTimeSelect
											showTimeSelectOnly
											timeIntervals={30}
											timeCaption="開始"
											dateFormat="HH:mm"
											placeholderText="開始時間"
											className="input input-bordered w-20 bg-base text-black border-gray-300 focus:outline-none focus:ring-2"
										/>
										<span className="text-gray-600">〜</span>
										<span className="text-sm text-gray-600">終了</span>
										<DatePicker
											selected={timeEnd}
											onChange={(d) => setTimeEnd(d)}
											showTimeSelect
											showTimeSelectOnly
											timeIntervals={30}
											timeCaption="終了"
											dateFormat="HH:mm"
											placeholderText="終了時間"
											className="input input-bordered w-20 bg-base text-black border-gray-300 focus:outline-none focus:ring-2"
										/>
									</div>
									<button
										type="button"
										className="btn btn-success btn-sm mt-2"
										disabled={!timeStart || !timeEnd}
										onClick={handleTimeConfirm}
									>
										時間を確定
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			<SubmitButton />
		</div>
	);
};

export default SubmitForm;
