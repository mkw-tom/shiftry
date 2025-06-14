import { MDW, YMDW } from "@/app/features/common/hooks/useFormatDate";
import React, { useEffect, useState } from "react";
import { PiUser } from "react-icons/pi";
import { TbCancel } from "react-icons/tb";
import { useCreateRequest } from "../../../context/useCreateRequest";
import AddSpecialShiftModal from "./AddSpecialShiftModal";

const SpecialShiftForm = () => {
	const { formData, setFormData } = useCreateRequest();
	const specialShiftData = formData.requests.overrideDates ?? {};

	const [inputDay, setInputDay] = useState("");
	const [openAddSpecialShiftModal, setOpenAddSpecialShiftModal] =
		useState(false);

	useEffect(() => {
		if (openAddSpecialShiftModal === false) return;
		if (inputDay && openAddSpecialShiftModal === true) {
			const dialog = document.getElementById(
				`modal_${inputDay}`,
			) as HTMLDialogElement | null;
			dialog?.showModal();
		}
	}, [inputDay, openAddSpecialShiftModal]);

	function handleAddSpecialDay(inputDay: string) {
		setFormData((prev) => ({
			...prev,
			requests: {
				...prev.requests,
				overrideDates: {
					...prev.requests.overrideDates,
					[inputDay]: [],
				},
			},
		}));
	}

	function removeOverrideDay(day: string) {
		setFormData((prev) => {
			// shallow copy してから削除
			const updatedOverrideDates = { ...prev.requests.overrideDates };
			delete updatedOverrideDates[day];

			return {
				...prev,
				requests: {
					...prev.requests,
					overrideDates: updatedOverrideDates,
				},
			};
		});
	}

	function handleAddClosedDate(inputDay: string) {
		setFormData((prev) => ({
			...prev,
			requests: {
				...prev.requests,
				overrideDates: {
					...prev.requests.overrideDates,
					[inputDay]: [],
				},
			},
		}));
		setInputDay("");
	}

	function parsePositon(position: string) {
		const [timeRange, people] = position.split("*");
		const [start, end] = timeRange.split("-");
		return {
			startTime: start.trim(),
			endTime: end.trim(),
			amount: people.trim(),
		};
	}

	return (
		<div className="h-[400px] pb-56 overflow-y-auto">
			<div className="w-full grid grid-cols-2 gap-2 items-center justify-between my-2 pl-2">
				<button
					type="button"
					className="btn text-white btn-sm bg-green01 border-none rounded-full"
					onClick={() => {
						const dialog = document.getElementById(
							"special_modal",
						) as HTMLDialogElement | null;
						dialog?.showModal();
					}}
				>
					特別な日のシフト
				</button>
				<dialog id="special_modal" className="modal">
					<div className="modal-box bg-base">
						<h3 className="text-lg text-green01 font-thin">特別な日</h3>
						<p className="py-4">
							<label htmlFor="" className="flex flex-col gap-1 ">
								<span className="text-black opacity-70">日にちを選択</span>
								<input
									type="date"
									className="input input-sm bg-gray01 text-black opacity-70"
									value={inputDay ? inputDay : ""}
									onChange={(e) => setInputDay(e.target.value)}
								/>
							</label>
						</p>
						<div className="modal-action w-full ">
							<form method="dialog">
								{/* if there is a button in form, it will close the modal */}
								<button
									type="submit"
									className="btn bg-gray02 text-white border-none rounded-full"
								>
									戻る
								</button>
								<button
									type="submit"
									className={`btn  border-none w-32 ml-1 rounded-full ${
										!inputDay
											? "text-gray02 bg-gray01 pointer-events-none"
											: "text-green02 bg-green03 "
									}`}
									onClick={() => {
										handleAddSpecialDay(inputDay);
										setOpenAddSpecialShiftModal(true);
									}}
								>
									保存
								</button>
							</form>
						</div>
					</div>
				</dialog>
				{/* 臨時休業日モーダル */}
				<button
					type="button"
					className="text-white btn btn-sm bg-gray02 border-none rounded-full "
					onClick={() => {
						const dialog = document.getElementById(
							"holiday_modal",
						) as HTMLDialogElement | null;
						dialog?.showModal();
					}}
				>
					臨時休業日
				</button>
				<dialog id="holiday_modal" className="modal">
					<div className="modal-box bg-base">
						<h3 className="text-lg text-black opacity-50 font-thin">
							臨時休業日
						</h3>
						<p className="py-4">
							<label htmlFor="" className="flex flex-col gap-1">
								<span className="text-black opacity-70">日にちを選択</span>
								<input
									type="date"
									className="input input-sm bg-gray01 text-black opacity-70"
									value={inputDay ? inputDay : ""}
									onChange={(e) => setInputDay(e.target.value)}
								/>
							</label>
						</p>
						<div className="modal-action">
							<form method="dialog">
								<button
									type="submit"
									className="btn bg-gray02 text-white border-none rounded-full"
								>
									戻る
								</button>
								<button
									type="submit"
									className={`btn   border-none w-32 ml-1 rounded-full ${
										!inputDay
											? "text-gray02 bg-gray01 pointer-events-none"
											: "text-green02 bg-green03 "
									}`}
									onClick={() => handleAddClosedDate(inputDay)}
								>
									保存
								</button>
							</form>
						</div>
					</div>
				</dialog>
			</div>
			<ul className="list ">
				{Object.entries(specialShiftData).map(([day, shifts]) => (
					<li
						key={day}
						className="list-row border-b-1 border-gray01 rounded-none"
					>
						<div className="text-md font-thin opacity-70 tabular-nums text-black ">
							{/* {getJapaneseDay(day as DayOfWeekType)} */}
							{MDW(new Date(day))}
						</div>
						<div className="list-col-grow">
							{shifts.length > 0 ? (
								<ul className="list-disc flex flex-col gap-1 w-full">
									{shifts.map((position, idx) => (
										<li key={position} className="flex items-center gap-3 ">
											<span className="flex items-center gap-1 text-black">
												<PiUser className="text-[15px]" />{" "}
												<span>{parsePositon(position).amount}</span>
											</span>{" "}
											<span className="text-black opacity-80">
												{parsePositon(position).startTime} -{" "}
												{parsePositon(position).endTime}
											</span>
										</li>
									))}
								</ul>
							) : (
								<p
									className={`${
										day === inputDay ? "text-gray02 " : "text-error"
									} opacity-80 text-sm flex items-center gap-1`}
								>
									<TbCancel />
									<span>臨時休業</span>
								</p>
							)}
						</div>
						{/* Open the modal using document.getElementById('ID').showModal() method */}
						{shifts.length > 0 ? (
							<button
								type="button"
								className="btn btn-sm rounded-full bg-green03 text-green02 border-none rounded-full"
								onClick={() => {
									// setInputDay(day)
									const dialog = document.getElementById(
										`modal_${day}`,
									) as HTMLDialogElement | null;
									dialog?.showModal();
								}}
							>
								追加
							</button>
						) : (
							<button
								type="button"
								className="text-white btn btn-sm btn-error shadow-none border-none rounded-full "
								onClick={() => {
									if (
										confirm(
											`臨時休業日：${YMDW(
												new Date(day),
											)}のデータを取り消しますか？`,
										)
									)
										removeOverrideDay(day);
								}}
							>
								削除
							</button>
						)}
						<AddSpecialShiftModal
							day={day}
							shifts={shifts}
							setOpenAddSpecialShiftModal={setOpenAddSpecialShiftModal}
							inputDay={inputDay}
							setInputDay={setInputDay}
						/>
					</li>
				))}
			</ul>
		</div>
	);
};

export default SpecialShiftForm;
