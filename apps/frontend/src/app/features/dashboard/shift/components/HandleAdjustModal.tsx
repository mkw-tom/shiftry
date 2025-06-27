import type { AssignShiftWithJson } from "@shared/common/types/merged";
import { type Dispatch, type SetStateAction, useState } from "react";
import { BiArrowToRight } from "react-icons/bi";
import { PiUser } from "react-icons/pi";
import { RiTimeLine } from "react-icons/ri";

const HandleAdjustModal = ({
	assignUser,
	shift,
	date,
	positions,
	setAssignShift,
	assignShift,
}: {
	assignUser: { name: string; userId: string };
	shift: { date: string; time: string } | undefined;
	date: { label: string; key: string };
	positions: string[];
	setAssignShift: Dispatch<SetStateAction<AssignShiftWithJson>>;
	assignShift: AssignShiftWithJson;
}) => {
	const [selectedPosition, setSelectedPosition] = useState<
		string | "free" | "holiday"
	>("シフトを選択");
	const [freeInput, setFreeInput] = useState<{
		startTime: string;
		endTime: string;
	}>({ startTime: "", endTime: "" });
	const handleAddShift = (addDate: string, userId: string, newTime: string) => {
		const userShifts =
			assignShift.shifts.find((shift) => shift.userId === userId)?.shifts || [];
		const updatedShifts = [...userShifts, { date: addDate, time: newTime }];

		setAssignShift({
			...assignShift,
			shifts: assignShift.shifts.map((shift) =>
				shift.userId === userId ? { ...shift, shifts: updatedShifts } : shift,
			),
		});
	};

	const handleUpdateShift = (
		editDate: string,
		userId: string,
		newTime: string,
	) => {
		const userShifts = assignShift.shifts.find(
			(shift) => shift.userId === userId,
		)?.shifts as { date: string; time: string }[];
		const updatedShift = userShifts.map((shift) => {
			if (shift.date === editDate) {
				return { ...shift, time: newTime };
			}
			return shift;
		}) as { date: string; time: string }[];

		setAssignShift({
			...assignShift,
			shifts: assignShift.shifts.map((shift) =>
				shift.userId === userId ? { ...shift, shifts: updatedShift } : shift,
			),
		});
	};

	const handleRemoveShift = (editDate: string, userId: string) => {
		const userShifts = assignShift.shifts.find(
			(shift) => shift.userId === userId,
		)?.shifts;
		const updatedShift = (
			userShifts as { date: string; time: string }[]
		).filter((shift) => shift.date !== editDate);
		setAssignShift({
			...assignShift,
			shifts: assignShift.shifts.map((shift) =>
				shift.userId === userId ? { ...shift, shifts: updatedShift } : shift,
			),
		});
	};

	const handleSubmit = (
		startTime: string,
		endTime: string,
		selectedPosition: string,
	) => {
		if (!shift) {
			if (selectedPosition === "free") {
				handleAddShift(date.key, assignUser.userId, `${startTime}-${endTime}`);
			} else {
				handleAddShift(date.key, assignUser.userId, selectedPosition);
			}
		} else {
			if (selectedPosition === "holiday") {
				handleRemoveShift(date.key, assignUser.userId);
			} else if (selectedPosition === "free") {
				handleUpdateShift(
					date.key,
					assignUser.userId,
					`${startTime}-${endTime}`,
				);
			} else {
				alert("変更");
				handleUpdateShift(date.key, assignUser.userId, selectedPosition);
			}
		}
	};

	const handleSubmitDisabled = () => {
		if (selectedPosition === "シフトを選択") {
			return true;
		}
		if (selectedPosition === "free") {
			return freeInput.startTime === "" || freeInput.endTime === "";
		}
		if (selectedPosition === "holiday") {
			return false;
		}
		return false;
	};

	const clearHandleAdjustForm = () => {
		setSelectedPosition("シフトを選択");
		setFreeInput({ startTime: "", endTime: "" });
	};

	return (
		<dialog
			id={`handle_adjust_modal_${date.key}${shift?.time}${assignUser.userId}`}
			className="modal modal-bottom sm:modal-middle"
		>
			<div className="modal-box bg-white relative">
				<h3 className="font-bold text-lg opacity-70 text-black text-start mt-5">
					手動シフト調整
				</h3>
				<ul className="mt-2 flex flex-col gap-1 md:flex-row md:gap-5 pl-1">
					<li className="text-start flex items-center gap-2">
						<PiUser className="inline-block text-lg" />
						<span className="font-thin text-black text-start">
							{assignUser.name}
						</span>
					</li>
					<li className="text-start flex items-center gap-2">
						<RiTimeLine
							className={`inline-block text-lg ${
								shift?.time !== undefined ? "text-green02" : "text-error"
							}`}
						/>
						<span
							className={`text-start ${
								shift?.time !== undefined ? "text-green02" : "text-error"
							}`}
						>
							{date.label}
						</span>
						<span
							className={`text-start ${
								shift?.time !== undefined ? "text-green02" : "text-error"
							}`}
						>
							{shift?.time !== undefined ? shift.time : "休み"}
						</span>
					</li>
				</ul>
				<div className="my-4 flex flex-col gap-3">
					{shift?.time !== undefined ? (
						<label className="flex flex-col gap-2">
							<span className="opacity-70 font-thin text-black text-start">
								シフト変更
							</span>
							<div className="flex items-center gap-1">
								<input
									type="text"
									className="input input-bordered  bg-gray01 text-black outline-none border-none pointer-events-none"
									value={shift?.time}
									readOnly
								/>
								<span className="text-lg opacity-70 font-thin text-black mx-1">
									<BiArrowToRight />
								</span>
								<select
									defaultValue="シフトを選択"
									className="select select-success bg-gray01"
									onChange={(e) => setSelectedPosition(e.target.value)}
								>
									<option disabled={true} value="シフトを選択">
										シフトを選択
									</option>
									<option value="free">自由入力</option>
									<option value="holiday">休み</option>
									{positions.map((position) => (
										<option key={position} value={position}>
											{position}{" "}
										</option>
									))}
								</select>
							</div>
						</label>
					) : (
						<label className="flex flex-col gap-2">
							<span className="text-sm opacity-70 font-thin text-black text-start">
								シフト追加
							</span>
							<div className="flex items-center gap-1">
								<select
									defaultValue="シフトを選択"
									className="select select-success bg-gray01"
									onChange={(e) => setSelectedPosition(e.target.value)}
								>
									<option disabled={true} value="シフトを選択">
										シフトを選択
									</option>
									<option value="free">自由入力</option>
									{positions.map((position) => (
										<option key={position} value={position}>
											{position}{" "}
										</option>
									))}
								</select>
							</div>
						</label>
					)}
					{selectedPosition === "free" && (
						<label className="flex flex-col gap-2">
							<span className="opacity-70 font-thin text-black text-start text-sm">
								自由入力
							</span>
							<div className="flex items-center gap-1">
								<input
									type="time"
									className="input input-bordered  bg-gray01 text-black outline-none border-none"
									onChange={(e) =>
										setFreeInput((prev) => ({
											...prev,
											startTime: e.target.value,
										}))
									}
								/>
								<span className="text-lg opacity-70 font-thin text-black mx-1">
									~
								</span>
								<input
									type="time"
									className="input input-bordered  bg-gray01 text-black outline-none border-none"
									onChange={(e) =>
										setFreeInput((prev) => ({
											...prev,
											endTime: e.target.value,
										}))
									}
								/>
							</div>
						</label>
					)}
				</div>
				<div className="modal-action">
					<form method="dialog" className="w-full flex items-center gap-1">
						<button
							type="submit"
							className="fixed top-3 right-0 left-0 w-32 bg-gray02 h-2 mx-auto rounded-sm pointer-events-auto"
							onClick={clearHandleAdjustForm}
						/>
						<button
							type="submit"
							className="btn bg-green02 text-white rounded-md w-full shadow-lg border-none"
							disabled={handleSubmitDisabled()}
							onClick={() =>
								handleSubmit(
									freeInput.startTime,
									freeInput.endTime,
									selectedPosition,
								)
							}
						>
							変更
						</button>
					</form>
				</div>
			</div>
		</dialog>
	);
};

export default HandleAdjustModal;
