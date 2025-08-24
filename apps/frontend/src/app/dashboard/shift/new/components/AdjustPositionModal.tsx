import type { RootState } from "@/app/redux/store";
import type { TimeSlotType } from "@shared/api/shift/request/validations/put";
import type {
	UpsertShiftPositionType,
	WeekDayType,
} from "@shared/api/shiftPosition/validations/put-bulk";
import { ja } from "date-fns/locale";
import { endpointWriteToDisk } from "next/dist/build/swc/generated-native";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { MdAdd, MdClose, MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { useBulkUpsertJobroles } from "../api/bulk-upsert-jobrole/hook";
import { useGetJobroles } from "../api/get-jobroles-all/hook";
import { useCreateRequest } from "../context/useCreateRequest";
import useAdjustCalenerJobrole from "../hook/useAdjustCalenerJobrole";

const AdjustPositionModal = ({
	time,
	date,
	editCalenderrPositon,
	setEditCalendarPosition,
	editTime,
	setEditTime,
}: {
	time: string;
	date: string;
	editCalenderrPositon: TimeSlotType;
	setEditCalendarPosition: React.Dispatch<React.SetStateAction<TimeSlotType>>;
	editTime: string;
	setEditTime: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const { members } = useSelector((state: RootState) => state.members);
	const { formData, setFormData } = useCreateRequest();

	const { handleGetJobroles } = useGetJobroles();
	const { handleBulkUpsertJobroles } = useBulkUpsertJobroles();

	const loadedRef = useRef(false);
	useEffect(() => {
		if (loadedRef.current) return; // 2回目以降は実行しない
		loadedRef.current = true;
		(async () => {
			const res = await handleGetJobroles();
			if (res.ok && "jobRoles" in res) {
				const jobrolesOnlyName = res.jobRoles.map((j) => j.name);
				setJobRoles(jobrolesOnlyName);
			}
		})();
	}, [handleGetJobroles]);

	const [jobRoles, setJobRoles] = useState<string[]>([
		"レジ",
		"清掃",
		"接客（英語）",
		"接客（スペイン語）",
	]);

	const [inputJobRoleValue, setInputJobRoleValue] = useState("");

	const { state, actions } = useAdjustCalenerJobrole({
		editCalendarPosition: editCalenderrPositon,
		setEditCalendarPosition: setEditCalendarPosition,
		jobRoles: jobRoles,
		setJobRoles: setJobRoles,
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

	const parseHHmm = (s: string | undefined | null): Date | null => {
		if (!s) return null;
		const [hh, mm] = s.split(":").map((v) => Number(v));
		if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
		const d = new Date();
		d.setHours(hh, mm, 0, 0);
		return d;
	};
	const fmtHHmm = (d: Date | null): string => {
		if (!d) return "";
		const hh = String(d.getHours()).padStart(2, "0");
		const mm = String(d.getMinutes()).padStart(2, "0");
		return `${hh}:${mm}`;
	};

	const [startStr, endStr] = (editTime ?? "")
		.split("-")
		.map((s) => s?.trim() || "");
	const startDate = parseHHmm(startStr);
	const endDate = parseHHmm(endStr);
	const setStart = (d: Date | null) => {
		setEditTime(`${fmtHHmm(d)} - ${endStr}`);
	};
	const setEnd = (d: Date | null) => {
		setEditTime(`${startStr} - ${fmtHHmm(d)}`);
	};

	const adjustStaffCount = (mode: "plus" | "minus") => {
		if (mode === "plus") {
			setEditCalendarPosition((prev) => ({
				...prev,
				count: prev.count + 1,
			}));
		} else if (mode === "minus" && editCalenderrPositon.count > 1) {
			setEditCalendarPosition((prev) => ({
				...prev,
				count: Math.max(1, prev.count - 1),
			}));
		}
	};

	const [showMemberList, setShowMemberList] = useState<{
		show: boolean;
		mode: "priorty" | "absolute";
	}>({ show: false, mode: "absolute" });

	const filteredSuggestions = jobRoles.filter((role) =>
		role.toLowerCase().includes(inputJobRoleValue.toLowerCase()),
	);

	const closeAdjustCalenerPositionModal = () => {
		const modal = document.getElementById(
			`${date}-${time}-${editCalenderrPositon.name}`,
		) as HTMLDialogElement;
		if (modal) {
			modal.close();
		}
		setEditCalendarPosition({
			name: "",
			count: 1,
			jobRoles: [],
			absolute: [],
			priority: [],
		});
		setEditTime("");
	};

	const saveEditCalenerPosition = () => {
		if (!formData.requests) return;
		const updatedRequests = { ...formData.requests };

		if (time === "new") {
			setFormData((prev) => ({
				...prev,
				requests: {
					...prev.requests,
					[date]: {
						...prev.requests[date],
						[editTime]: editCalenderrPositon,
					},
				},
			}));
			return;
		}

		if (updatedRequests[date]) {
			updatedRequests[date][time] = editCalenderrPositon;
		} else {
			updatedRequests[date] = { [time]: editCalenderrPositon };
		}
		if (date !== editTime) {
			const newRequests = Object.entries(updatedRequests[date]).map(
				([timeSlot, position]) => {
					if (timeSlot === time) {
						return { [editTime]: position };
					}
				},
			);
			updatedRequests[date] = Object.assign({}, ...newRequests);
		}
		setFormData((prev) => ({
			...prev,
			requests: updatedRequests,
		}));
	};

	// const convertToDate = (time: string): Date | null => {
	//   if (!time) return null;
	//   const date = new Date(time); // ISO 形式も HH:mm も両方許容
	//   return Number.isNaN(date.getTime()) ? null : date;
	// };

	return (
		<dialog
			id={`${date}-${editTime}-${editCalenderrPositon.name}`}
			className="modal modal-bottom"
		>
			<div className="modal-box h-auto bg-white">
				<input
					className="w-full outline-none text-gray-600 font-bold"
					placeholder="ポジション名を入力（例：ホール担当)"
					onChange={(e) =>
						setEditCalendarPosition((prev) => ({
							...prev,
							name: e.target.value,
						}))
					}
					value={editCalenderrPositon.name}
				/>

				<div className="py-4">
					<div className="flex items-center  gap-6">
						<div className="flex flex-col gap-2">
							<h3 className="text-sm text-gray-600">勤務時間（開始〜終了）</h3>
							<div className="flex items-center gap-3 h-9">
								<div className="flex items-center gap-3 h-9">
									<DatePicker
										selected={startDate} // ← Date を渡す
										onChange={setStart} // ← Date を受け取り state 更新
										showTimeSelect
										showTimeSelectOnly
										timeIntervals={30}
										timeCaption="出勤"
										dateFormat="HH:mm" // ← 表示はこれに任せる
										locale={ja}
										placeholderText="出勤"
										className="input input-bordered w-18 border bg-base text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-success"
									/>
									<span className="text-gray-600">〜</span>
									<DatePicker
										selected={endDate}
										onChange={setEnd}
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
								<span className="mx-2 text-black">
									{editCalenderrPositon.count}
								</span>
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
										<ul className="flex flex-col gap-1 text-black">
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
								<div className="absolute top-5 z-10 bg-white border border-gray-300 rounded shadow-lg w-5/6 max-h-72 overflow-y-auto">
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
															onClick={() => actions.editJobRoleName(index)}
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
								onClick={() => actions.addJobRole(inputJobRoleValue)}
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
							{editCalenderrPositon.jobRoles.map((role, index) => (
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
				</div>

				{showMemberList.show && (
					<div className="absolute bottom-32 right-0 left-0 mt-5 z-40 bg-white border border-gray-300 rounded shadow-lg p-4 mx-3">
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
														editCalenderrPositon.absolute.some(
															(s) => s.id === staff.user.id,
														)
													)
														return;
													setEditCalendarPosition((prev) => ({
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
														editCalenderrPositon.priority.some(
															(s) => s.id === staff.user.id,
														)
													)
														return;
													setEditCalendarPosition((prev) => ({
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
											{editCalenderrPositon.absolute.some(
												(s) => s.id === staff.user.id,
											) && (
												<span className="badge badge-sm bg-blue-500 text-white">
													<button
														type="button"
														className="mr-1"
														onClick={() => {
															setEditCalendarPosition((prev) => ({
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
											{editCalenderrPositon.priority.some(
												(s) => s.id === staff.user.id,
											) && (
												<span className="badge badge-sm bg-green-500 text-white">
													<button
														type="button"
														className="mr-1"
														onClick={() => {
															setEditCalendarPosition((prev) => ({
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
					{editCalenderrPositon.absolute.length > 0 ? (
						<div className="avatar-group -space-x-1 ml-3">
							{editCalenderrPositon.absolute.map((staff) => (
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
					{editCalenderrPositon.priority.length > 0 ? (
						<div className="avatar-group -space-x-1 ml-3">
							{editCalenderrPositon.priority.map((staff) => (
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

				<div className="modal-action">
					<form method="dialog" className="flex items-center gap-1 w-full">
						{/* if there is a button in form, it will close the modal */}
						<button
							type="submit"
							className="btn bg-gray02 text-white w-1/3 border-none"
							onClick={() => {
								closeAdjustCalenerPositionModal();
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
								saveEditCalenerPosition();
								saveJobRoles();
								setInputJobRoleValue("");
							}}
						>
							<MdAdd className="text-lg" />
							{time === "new" ? "追加" : "編集"}
						</button>
					</form>
				</div>
			</div>
		</dialog>
	);
};

export default AdjustPositionModal;
