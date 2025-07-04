import { MDW } from "@/app/features/common/hooks/useFormatDate";
import { MdOutlineHolidayVillage } from "react-icons/md";
import { RiTimeLine } from "react-icons/ri";
import type { DayOfWeekType } from "./SubmittedShiftLIst";
import { SubmittedShiftWithJson } from "@shared/common/types/merged";

const SubmittedShiftListModal = ({
	data,
}: { data: SubmittedShiftWithJson }) => {
	const parseTimeRange = (data: string) => {
		const [availableDay, timeRange] = data.split("&");
		if (timeRange === undefined) {
			return { day: availableDay };
		}
		const [start, end] = timeRange.split("-");
		return {
			day: availableDay,
			startTime: start.trim(),
			endTime: end.trim(),
		};
	};

	const getJapaneseDay = (day: DayOfWeekType): string => {
		const dayMap: { [key: string]: string } = {
			Monday: "月曜",
			Tuesday: "火曜",
			Wednesday: "水曜",
			Thursday: "木曜",
			Friday: "金曜",
			Saturday: "土曜",
			Sunday: "日曜",
		};
		return dayMap[day] || day;
	};

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

	return (
		<>
			<button
				type="button"
				className="btn btn-sm bg-green03 text-green02 rounded-md border-none"
				onClick={() => {
					const modal = document.getElementById(`show_submit_data_${data.id}`);
					if (modal instanceof HTMLDialogElement) {
						modal.showModal();
					}
				}}
			>
				開く
			</button>
			<dialog id={`show_submit_data_${data.id}`} className="modal">
				<div className="modal-box bg-base text-black">
					<div className="flex items-center justify-between">
						<div className=" flex items-center flex-1 gap-2">
							<div className="w-7 h-7 bg-gray01 rounded-full" />
							<span className="text-sm  text-black">{data.shifts.name}</span>
						</div>
						<span className="text-xs text-balck opacity-70">
							出勤：週{data.shifts.weekCountMin}回〜{data.shifts.weekCountMax}回
						</span>
					</div>
					<div className="py-4 flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<h3 className="text-sm font-thin text-green01">特定日の希望</h3>
							</div>
							<div className="flex flex-col gap-2 pl-1">
								{data.shifts.specificDates.length === 0 ? (
									<span className="text-xs text-black opacity-70">
										提出なし
									</span>
								) : (
									data.shifts.specificDates.map((date) => {
										const {
											date: specificDate,
											startTime,
											endTime,
										} = parseSpecificDateTime(date);
										return (
											<div key={date} className="flex items-center gap-2">
												<span className="text-xs text-black opacity-70">
													{MDW(new Date(specificDate))}
												</span>
												{startTime !== undefined && endTime !== undefined ? (
													<span className="text-xs text-black opacity-70 flex items-center gap-1">
														<RiTimeLine className="text-xs" />
														<span>
															出勤可能：{startTime} ~ {endTime}
														</span>
													</span>
												) : (
													<span className="text-xs text-error flex items-center gap-1">
														<MdOutlineHolidayVillage className="text-xs" />
														<span>休み希望</span>
													</span>
												)}
											</div>
										);
									})
								)}
							</div>
						</div>
						<hr className="text-gray01 " />
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<h3 className="text-sm font-thin text-black opacity-70">
									曜日シフト
								</h3>
							</div>
							<ul className="flex flex-col gap-2 pl-1">
								{data.shifts.availableWeeks.map((date) => {
									const { day, startTime, endTime } = parseTimeRange(date);
									return (
										<li key={date} className="flex items-center gap-4">
											<span className="text-xs text-black opacity-70 font-thin">
												{getJapaneseDay(day as DayOfWeekType)}
											</span>
											{startTime !== undefined && endTime !== undefined ? (
												<span className="text-xs text-black opacity-70 flex items-center gap-1">
													<RiTimeLine className="text-xs" />
													<span>
														出勤可能：{startTime} ~ {endTime}
													</span>
												</span>
											) : (
												<span className="text-xs text-black opacity-70 flex items-center gap-1">
													<RiTimeLine className="text-xs" />
													<span>指定なし</span>
												</span>
											)}
										</li>
									);
								})}
							</ul>
						</div>
					</div>
					<div className="modal-action">
						<form method="dialog">
							<button
								type="submit"
								className="btn bg-gray02 text-white rounded-md border-none"
							>
								閉じる
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
};

export default SubmittedShiftListModal;
