import React, { useMemo } from "react";
import { FcCancel } from "react-icons/fc";
import { useSubmitShiftForm } from "../context/SubmitShiftFormContextProvider";

const ShiftTable = ({ openModal }: { openModal: (date: string) => void }) => {
	const { shiftRequestData, formData, setFormData } = useSubmitShiftForm();

	const weekDayLabels = ["日", "月", "火", "水", "木", "金", "土"];

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

	const dateList = useMemo(() => {
		return allDates.map((dateStr) => {
			const d = new Date(dateStr);
			const label = Number.isNaN(d.getTime()) ? "?" : weekDayLabels[d.getDay()];
			const slots = shiftRequestData.requests[dateStr]; // その日のタイムスロット
			const isHoliday = !slots || Object.keys(slots).length === 0; // 空 or undefined を休日扱い
			return { date: dateStr, label, isHoliday };
		});
	}, [allDates, shiftRequestData]);

	const pageSize = 7;
	const weeks = useMemo(() => {
		const chunks: (typeof dateList)[] = [];
		for (let i = 0; i < dateList.length; i += pageSize) {
			chunks.push(dateList.slice(i, i + pageSize));
		}
		return chunks;
	}, [dateList]);

	const headerWeek = weeks[0] ?? [];

	const holidayDates = useMemo(
		() => dateList.filter((d) => d.isHoliday).map((d) => d.date),
		[dateList],
	);

	return (
		<div>
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
		</div>
	);
};

export default ShiftTable;
