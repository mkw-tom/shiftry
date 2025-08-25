import type { RootState } from "@/redux/store";
import { UserLite } from "@shared/api/common/types/prismaLite";
import type {
	UpsertShiftPositionType,
	WeekDayType,
} from "@shared/api/shiftPosition/validations/put-bulk";
import { add, format, set } from "date-fns";
import { ja } from "date-fns/locale";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { Week } from "react-day-picker";
import { MdAdd, MdCheck, MdClose, MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import TimePicker from "react-time-picker";
import { toast } from "react-toastify";
import { fa } from "zod/v4/locales";
import { useBulkUpsertJobroles } from "../api/bulk-upsert-jobrole/hook";
import { useGetJobroles } from "../api/get-jobroles-all/hook";
import useUpsertJobrole from "../hook/useUpsertJobrole";
import useUpsertPosition from "../hook/useUpsertPosition";

const UpsertPositionModal = ({
	position,
	setPosition,
	handleSavePosition,
	closeModal,
	editIndex,
}: {
	position: UpsertShiftPositionType;
	setPosition: React.Dispatch<React.SetStateAction<UpsertShiftPositionType>>;
	handleSavePosition: (position: UpsertShiftPositionType) => void;
	closeModal: () => void;
	editIndex: number | null;
}) => {
	const { members } = useSelector((state: RootState) => state.members);
	const { handleGetJobroles } = useGetJobroles();
	const { handleBulkUpsertJobroles } = useBulkUpsertJobroles();

	const loadedRef = useRef(false);
	useEffect(() => {
		if (loadedRef.current) return; // 2回目以降は実行しない
		loadedRef.current = true;
		(async () => {
			const res = await handleGetJobroles();
			if (!res.ok && "message" in res) {
				alert(res.message);
				return;
			}
			const jobrolesOnlyName = res.jobRoles.map((j) => j.name);
			setJobRoles(jobrolesOnlyName);
		})();
	}, [handleGetJobroles]);

	const [jobRoles, setJobRoles] = useState<string[]>([]);

	const { selectDate, adjustStaffCount, checkWeeks } = useUpsertPosition({
		position,
		setPosition,
	});

	const { state, actions } = useUpsertJobrole({
		position,
		setPosition,
		jobRoles,
		setJobRoles,
	});

	const saveJobRoles = async () => {
		actions.saveJobRoleDatas();
		actions.closeAllJobRoleListModal();
		const { added, deleted } = state.updated;
		if (added === 0 && deleted === 0) return;
		const res = await handleBulkUpsertJobroles({ names: jobRoles });
		if (!res.ok && "message" in res) {
			alert(res.message);
			return;
		}
		actions.setUpdated({ added: 0, deleted: 0 });
	};

	const [showMemberList, setShowMemberList] = useState<{
		show: boolean;
		mode: "priorty" | "absolute";
	}>({ show: false, mode: "absolute" });

	const [inputJobRoleValue, setInputJobRoleValue] = useState("");

	const filteredSuggestions = jobRoles.filter((role) =>
		role.toLowerCase().includes(inputJobRoleValue.toLowerCase()),
	);

	const weeksArray: { label: string; value: WeekDayType }[] = [
		{ label: "月曜", value: "monday" },
		{ label: "火曜", value: "tuesday" },
		{ label: "水曜", value: "wednesday" },
		{ label: "木曜", value: "thursday" },
		{ label: "金曜", value: "friday" },
		{ label: "土曜", value: "saturday" },
		{ label: "日曜", value: "sunday" },
	];

	const convertToDate = (time: string): Date | null => {
		if (!time) return null;
		const date = new Date(time); // ISO 形式も HH:mm も両方許容
		return Number.isNaN(date.getTime()) ? null : date;
	};

	return (
		<dialog id={`position_${position.name}`} className="modal modal-bottom">
			<div className="modal-box h-auto bg-white">
				<input
					className="w-full outline-none text-gray-600 font-bold"
					placeholder="ポジション名を入力（例：ホール担当)"
					onChange={(e) =>
						setPosition((prev) => ({
							...prev,
							name: e.target.value,
						}))
					}
					value={position.name}
				/>

				<div className="py-4">
					<div className="flex items-center  gap-6">
						<div className="flex flex-col gap-2">
							<h3 className="text-sm text-gray-600">勤務時間（開始〜終了）</h3>
							<div className="flex items-center gap-3 h-9">
								<DatePicker
									selected={
										position.startTime !== ""
											? convertToDate(position.startTime)
											: null
									}
									onChange={(date) => selectDate(date, "startTime")}
									value={
										convertToDate(position.startTime)
											? convertToDate(position.startTime)?.toLocaleTimeString(
													[],
													{
														hour: "2-digit",
														minute: "2-digit",
														hour12: false,
													},
												)
											: ""
									}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={30}
									timeCaption="出勤"
									dateFormat="HH:mm"
									locale={ja}
									placeholderText="出勤"
									className="input input-bordered w-18 border bg-base text-black border-gray-300 focus:outline-none. focus:ring-2 focus:ring-success"
								/>
								<span className="text-gray-600">〜</span>
								<DatePicker
									selected={
										position.endTime !== ""
											? convertToDate(position.endTime)
											: null
									}
									onChange={(date) => selectDate(date, "endTime")}
									value={
										convertToDate(position.endTime)
											? convertToDate(position.endTime)?.toLocaleTimeString(
													[],
													{
														hour: "2-digit",
														minute: "2-digit",
														hour12: false,
													},
												)
											: ""
									}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={30}
									timeCaption="退勤"
									dateFormat="HH:mm"
									locale={ja}
									placeholderText="退勤"
									className="input input-bordered w-18 border bg-base text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-success"
								/>
							</div>
						</div>

						<div className="flex flex-col items-start">
							<h3 className="text-sm text-gray-600">人数</h3>
							<div className="flex items-center h-11 gap-1">
								<button
									type="button"
									onClick={() => adjustStaffCount("minus")}
									className="btn btn-sm btn-circle btn-success w-5 h-5 px-0"
								>
									−
								</button>
								<span className="mx-2 text-black">{position.count}</span>
								<button
									type="button"
									onClick={() => adjustStaffCount("plus")}
									className="btn btn-sm btn-circle btn-success w-5 h-5 px-0"
								>
									＋
								</button>
							</div>
						</div>
					</div>

					<div className="mt-5 w-full h-auto">
						<h3 className="text-sm text-gray-600">固定曜日</h3>
						<ul className="flex flex-wrap items-center gap-2 m-1">
							{weeksArray.map((day) => (
								<li key={day.value} className="flex items-center">
									<input
										type="checkbox"
										checked={position.weeks.includes(day.value)}
										onChange={(e) => {
											checkWeeks(day, e);
										}}
										className="checkbox checkbox-sm checkbox-success border-gray01"
									/>
									<span className="ml-2 text-sm text-gray-600">
										{day.label}
									</span>
								</li>
							))}
						</ul>
					</div>

					<div className="mt-5 w-full h-auto">
						<h3 className="text-sm text-gray-600">業務バッジを追加（任意）</h3>
						<div className="flex items-center gap-1">
							<input
								value={inputJobRoleValue}
								onChange={(e) => setInputJobRoleValue(e.target.value)}
								className="input input-bordered w-4/5 text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-success"
								placeholder="業務名を入力 （例：レジ）"
							/>

							{inputJobRoleValue === "" ||
								(filteredSuggestions.length > 0 && (
									<div className="absolute top-44 z-10 bg-white border border-gray-300 rounded shadow-lg w-4/5 max-h-20 overflow-y-auto px-3 py-1.5">
										<ul className="flex flex-col gap-1">
											{filteredSuggestions.map((role) => (
												<li
													key={role}
													onClick={() => {
														actions.addJobRole(role);
														setInputJobRoleValue("");
													}}
													className="cursor-pointer hover:bg-gray-100 text-sm"
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															actions.addJobRole(role);
															setInputJobRoleValue("");
														}
													}}
												>
													{role}
												</li>
											))}
										</ul>
									</div>
								))}

							{state.showALlJobRoles === true && (
								<div className="absolute top-20 z-10 bg-white border border-gray-300 rounded shadow-lg w-5/6 max-h-72 overflow-y-auto">
									<div className="flex items-center justify-between bg-gray-100 sticky top-0">
										<h2 className="text-sm text-gray-600 font-bold px-3 py-1">
											業務一覧
										</h2>
										<button
											type="button"
											className="btn btn-link btn-sm w-20 text-gray-600"
											onClick={actions.closeAllJobRoleListModal}
										>
											閉じる
										</button>
									</div>
									<ul className="flex flex-col">
										{jobRoles.map((role, index) => (
											<li
												key={role}
												className={`cursor-pointer text-sm flex items-center justify-between py-2 px-3 ${
													state.editJobRole !== null &&
													state.editJobRole !== index
														? "bg-gray-700"
														: ""
												}`}
											>
												{state.editJobRole !== index ? (
													<button
														type="button"
														onClick={() =>
															actions.addJobRoleFromAllJobRolesList(role)
														}
														className="text-black"
													>
														{role}
													</button>
												) : (
													<input
														type="text"
														value={state.editInputValue}
														onChange={(e) =>
															state.setEditInputValue(e.target.value)
														}
														className="input input-sm input-bordered w-4/6 text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-success"
													/>
												)}

												{state.editJobRole !== index ? (
													<div className="flex gap-2">
														{/* <button
                              type="button"
                              className="btn btn-xs btn-square btn-success"
                              onClick={() => {
                                state.setEditJobRole(index);
                                state.setEditInputValue(role);
                              }}
                              disabled={
                                state.editJobRole !== null &&
                                state.editJobRole !== index
                              }
                            >
                              <MdEdit />
                            </button> */}
														<button
															type="button"
															className="text-gray02"
															onClick={() =>
																actions.deleteJobRoleFromAllJobRoleList(role)
															}
															disabled={
																state.editJobRole !== null &&
																state.editJobRole !== index
															}
														>
															<MdDelete />
														</button>
													</div>
												) : (
													<div className="flex gap-1 items-center">
														<button
															type="button"
															className="btn btn-xs btn-success"
															onClick={() => {
																actions.editJobRoleName(index);
															}}
														>
															保存
														</button>
														<button
															type="button"
															className="btn btn-xs btn-error"
															onClick={actions.cancelEditJobRole}
														>
															<MdClose />
														</button>
													</div>
												)}
											</li>
										))}
									</ul>
								</div>
							)}

							<button
								type="button"
								onClick={() => {
									actions.addJobRole(inputJobRoleValue);
									setInputJobRoleValue("");
								}}
								className="btn bg-green01 btn-square border-none text-white"
							>
								<MdAdd />
							</button>
							<button
								type="button"
								className="btn btn-link btn-success btn-sm w-20"
								onClick={() => state.setShowAllJobRoles(!state.showALlJobRoles)}
							>
								一覧表示
							</button>
						</div>

						{/* 追加済みバッジ */}
						<ul className="mt-2 flex flex-wrap gap-1">
							{position.jobRoles.map((role, index) => (
								<li
									key={role}
									className="badge badge-sm text-white bg-gray02 border-none"
								>
									<button
										type="button"
										className="text-white"
										onClick={() => actions.deleteJobRole(role)}
									>
										×
									</button>
									{role}
								</li>
							))}
						</ul>
					</div>

					{showMemberList.show && (
						<div className="absolute bottom-50 right-0 left-0 mt-5 z-40 bg-white border border-gray-300 rounded shadow-lg p-4 mx-3">
							<div className="flex items-center justify-between">
								<h3 className="text-sm text-gray-600">スタッフ一覧</h3>
								<button
									type="button"
									className="btn btn-link btn-sm w-20 text-gray-600"
									onClick={() =>
										setShowMemberList((prev) => ({ ...prev, show: false }))
									}
								>
									閉じる
								</button>
							</div>
							<div className="max-h-60 overflow-y-auto">
								<ul className="flex flex-col gap-2">
									{members.map((staff) => (
										<li
											key={staff.user.id}
											className="cursor-pointer text-sm flex items-center justify-between py-2 px-3 hover:bg-gray-100"
										>
											<button
												type="button"
												className="flex items-center gap-3"
												onClick={() => {
													if (showMemberList.mode === "absolute") {
														if (
															position.absolute.some(
																(s) => s.id === staff.user.id,
															)
														)
															return;
														setPosition((prev) => ({
															...prev,
															absolute: [
																...prev.absolute,
																{
																	name: staff.user.name,
																	id: staff.user.id,
																	pictureUrl: staff.user.pictureUrl as string,
																},
															],
														}));
													} else if (showMemberList.mode === "priorty") {
														if (
															position.priority.some(
																(s) => s.id === staff.user.id,
															)
														)
															return;
														setPosition((prev) => ({
															...prev,
															priority: [
																...prev.priority,
																{
																	name: staff.user.name,
																	id: staff.user.id,
																	pictureUrl: staff.user.pictureUrl as string,
																	level: 1,
																},
															],
														}));
													}
												}}
											>
												<div className="avatar">
													<div className="w-8 rounded-full">
														<img
															src={staff.user.pictureUrl as string}
															alt={staff.user.name}
														/>
													</div>
												</div>
												<span className="text-black">{staff.user.name}</span>
											</button>
											<div className="flex items-center gap-2">
												{position.absolute.some(
													(s) => s.id === staff.user.id,
												) && (
													<span className="badge badge-sm bg-blue-500 text-white">
														<button
															type="button"
															className="mr-1"
															onClick={() => {
																setPosition((prev) => ({
																	...prev,
																	absolute: prev.absolute.filter(
																		(s) => s.id !== staff.user.id,
																	),
																}));
															}}
														>
															<MdClose />
														</button>
														固定
													</span>
												)}
												{position.priority.some(
													(s) => s.id === staff.user.id,
												) && (
													<span className="badge badge-sm bg-green-500 text-white">
														<button
															type="button"
															className="mr-1"
															onClick={() => {
																setPosition((prev) => ({
																	...prev,
																	priority: prev.priority.filter(
																		(s) => s.id !== staff.user.id,
																	),
																}));
															}}
														>
															<MdClose />
														</button>
														優先
													</span>
												)}
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					)}

					<div className="mt-5 w-full h-auto flex items-center gap-2">
						<button
							type="button"
							className="btn btn-sm btn-circle border-1 border-dashed border-gray01"
							onClick={() =>
								setShowMemberList((prev) => ({ show: true, mode: "absolute" }))
							}
						>
							<MdAdd />
						</button>
						<h3 className="text-sm text-gray-600">固定スタッフ</h3>
						{position.absolute.length > 0 ? (
							<div className="avatar-group -space-x-1 ml-3">
								{position.absolute.map((staff) => (
									<div className="avatar" key={staff.id}>
										<div className="w-5">
											<img src={staff.pictureUrl as string} alt={staff.name} />
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray02 text-sm flex-1 text-center">未設定</p>
						)}
					</div>
					<div className="mt-4 w-full h-auto flex items-center gap-2">
						<button
							type="button"
							className="btn btn-sm btn-circle border-1 border-dashed border-gray01"
							onClick={() =>
								setShowMemberList((prev) => ({ show: true, mode: "priorty" }))
							}
						>
							<MdAdd />
						</button>
						<h3 className="text-sm text-gray-600">優先スタッフ</h3>
						{position.priority.length > 0 ? (
							<div className="avatar-group -space-x-1 ml-3">
								{position.priority.map((staff) => (
									<div className="avatar" key={staff.id}>
										<div className="w-5">
											<img src={staff.pictureUrl as string} alt={staff.name} />
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray02 text-sm flex-1 text-center">未設定</p>
						)}
					</div>
				</div>
				<div className="modal-action">
					<form method="dialog" className="flex items-center gap-1 w-full">
						{/* if there is a button in form, it will close the modal */}
						<button
							type="submit"
							className="btn bg-gray02 text-white w-1/3 border-none"
							onClick={() => {
								closeModal();
								setInputJobRoleValue("");
								actions.closeAllJobRoleListModal();
							}}
						>
							中止
						</button>
						<button
							type="submit"
							className="btn bg-green01 text-white w-2/3 border-none"
							onClick={() => {
								handleSavePosition(position);
								setInputJobRoleValue("");
								saveJobRoles();
								closeModal();
							}}
						>
							<MdAdd className="text-lg" />
							{editIndex !== null ? "編集" : "追加"}
						</button>
					</form>
				</div>
			</div>
		</dialog>
	);
};

export default UpsertPositionModal;
