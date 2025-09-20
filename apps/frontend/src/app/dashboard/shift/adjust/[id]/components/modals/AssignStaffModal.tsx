// import { dummyMembers } from "@/app/utils/dummyData/member";
import { formatTimeRangeHHmm } from "@/app/utils/times";
import type { RootState } from "@/redux/store.js";
import {
	type AssignPositionType,
	AssignPositionWithDateInput,
} from "@shared/api/shift/assign/validations/put";
import { YMDW } from "@shared/utils/formatDate";
import React, { useEffect } from "react";
import { IoWarning } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useAdjustShiftForm } from "../../context/AdjustShiftFormContextProvider.tsx";

const AssignStaffModal = ({
	date,
	time,
	assignStaffData,
}: {
	date: string;
	time: string;
	assignStaffData: {
		name: string;
		count: number;
		assigned: AssignPositionType["assigned"];
	};
}) => {
	const {
		assignShiftData,
		submittedShiftList,
		setAssignShiftData,
		shiftRequestData,
	} = useAdjustShiftForm();

	const initialAssigned = (assignStaffData.assigned ?? []).map((a) => a.uid);
	const [checkedUids, setCheckedUids] =
		React.useState<string[]>(initialAssigned);

	useEffect(() => {
		setCheckedUids((assignStaffData.assigned ?? []).map((a) => a.uid));
	}, [assignStaffData]);

	const closeAssignStaffModal = () => {
		const modal = document.getElementById(
			`${date}-${time}-${assignStaffData.name}-assign-staff`,
		) as HTMLDialogElement | null;
		modal?.close();
	};

	const handleSave = () => {
		const modal = document.getElementById(
			`${date}-${time}-${assignStaffData.name}-assign-staff`,
		) as HTMLDialogElement | null;

		setAssignShiftData((prev) => {
			const newAssigned = checkedUids
				.map((uid) => {
					const member = members.find((m) => m.user.id === uid);
					if (!member) return null;
					return {
						uid: member.user.id,
						displayName: member.user.name,
						pictureUrl: member.user.pictureUrl ?? undefined, // null→undefined
						source: "manual" as const, // 型を明示
						confirmed: false,
					};
				})
				.filter(
					(
						a,
					): a is {
						uid: string;
						displayName: string;
						pictureUrl: string | undefined;
						source: "manual";
						confirmed: boolean;
					} => a !== null,
				); // 型ガードでnull除外

			return {
				...prev,
				shifts: {
					...prev.shifts,
					[date]: {
						...prev.shifts?.[date],
						[time]: {
							...prev.shifts?.[date]?.[time],
							assigned: newAssigned,
							assignedCount: newAssigned.length,
							vacancies:
								(prev.shifts?.[date]?.[time]?.count ?? 0) - newAssigned.length,
						},
					},
				},
			};
		});
		modal?.close();
		// checkedUidsを初期値に戻す
	};
	// ...existing code...

	// dateに希望があるstaffId一覧
	const hopeStaffIds = submittedShiftList
		.filter(
			(sub) => sub.shifts[date] !== null && sub.shifts[date] !== undefined,
		)
		.map((sub) => sub.userId);

	const { members } = useSelector((state: RootState) => state.members);

	const assignedMembers = members.filter((m) =>
		(assignShiftData.shifts?.[date]?.[time]?.assigned ?? []).some(
			(a) => a.uid === m.user.id,
		),
	);

	const previewVacancies = assignStaffData.count - checkedUids.length;

	const allMemberIds = Array.from(
		new Set([
			...hopeStaffIds,
			...members.map((m) => m.user.id),
			...assignedMembers.map((m) => m.user.id),
		]),
	);
	const allMembers = allMemberIds
		.map((id) => members.find((m) => m.user.id === id))
		.filter(Boolean);

	return (
		<dialog
			id={`${date}-${time}-${assignStaffData.name}-assign-staff`}
			className="modal"
		>
			<form className="modal-box h-auto  bg-white">
				<div className=" text-gray-600 font-bold mb-2">
					{YMDW(new Date(date))}
				</div>
				<h2 className="font-bold text-green02 mb-3 ml-1">
					{assignStaffData.name}
				</h2>
				<div className="flex items-center mb-3 ml-1">
					<div className="flex items-center gap-3">
						<p className="flex items-center badge badge-sm bg-white text-gray-800 border-gray02">
							<LuUserRound className="text-gray-600 text-[14px]" />
							<span className="text-gray-600 font-bold">
								{assignStaffData.count}
							</span>
						</p>
						<p className="text-gray-600 font-bold">
							{formatTimeRangeHHmm(time)}
						</p>
					</div>
				</div>
				<ul className="mb-4 flex flex-col gap-2 w-full max-h-[400px] overflow-y-auto">
					{allMembers.length === 0 ? (
						<li className="text-gray-400">該当者なし</li>
					) : (
						allMembers.map((m) => {
							if (!m) return null;
							// チェック状態
							const isChecked = checkedUids.includes(m.user.id);
							// 希望時間帯取得
							const submitted = submittedShiftList.find(
								(sub) => sub.userId === m.user.id,
							);
							const hopeTime = submitted?.shifts[date] ?? null;
							// ポジションのtime（propsのtime）と一致 もしくは 範囲内に収まるか
							let isTimeMatch = hopeTime === time || hopeTime === "anytime";
							if (
								!isTimeMatch &&
								hopeTime &&
								hopeTime !== "anytime" &&
								hopeTime.includes("-") &&
								time.includes("-")
							) {
								const toMinutes = (t: string) => {
									const [h, m] = t.split(":").map(Number);
									return h * 60 + m;
								};
								const [assignStartStr, assignEndStr] = time.split("-");
								const [hopeStartStr, hopeEndStr] = hopeTime.split("-");
								if (
									assignStartStr &&
									assignEndStr &&
									hopeStartStr &&
									hopeEndStr
								) {
									const assignStart = toMinutes(assignStartStr);
									const assignEnd = toMinutes(assignEndStr);
									const hopeStart = toMinutes(hopeStartStr);
									const hopeEnd = toMinutes(hopeEndStr);
									// 希望時間帯がアサイン時間帯の範囲内に完全に収まる場合はマッチ扱い
									if (hopeStart >= assignStart && hopeEnd <= assignEnd) {
										isTimeMatch = true;
									}
								}
							}
							// 希望者かどうか
							const isHope = hopeStaffIds.includes(m.user.id);
							// assignedのみ（希望者でも非希望者でもない）
							const assignedData = (
								assignShiftData.shifts?.[date]?.[time]?.assigned ?? []
							).find((a) => a.uid === m.user.id);
							const isAssignedOnly =
								assignedMembers.some((am) => am.user.id === m.user.id) &&
								!isHope;
							// 固定・優先バッジ（assignShiftData.shiftsから判定）
							let sourceBadge = null;
							const shiftPos = shiftRequestData.requests?.[date]?.[time];
							if (shiftPos) {
								if (shiftPos.absolute?.some((u) => u.id === m.user.id)) {
									sourceBadge = (
										<span className="badge badge-sm badge-dash text-info text-xs ml-1">
											固定
										</span>
									);
								} else if (shiftPos.priority?.some((u) => u.id === m.user.id)) {
									sourceBadge = (
										<span className="badge badge-sm badge-dash text-green01 text-xs ml-1">
											優先
										</span>
									);
								}
							}
							return (
								<li
									key={m.user.id}
									className={`flex items-center justify-between gap-2 w-full p-2 ${!isHope ? "bg-gray-100" : ""}`}
								>
									<div className="flex items-center gap-2 flex-1">
										<div />
										<img
											src={m.user.pictureUrl ?? ""}
											alt={m.user.name}
											className="w-8 h-8 rounded-full"
										/>
										<div className="flex flex-col">
											<div className="flex items-center gap-2">
												<span
													className={
														isHope
															? "font-bold text-gray-700"
															: "font-bold text-gray-400"
													}
												>
													{m.user.name}
												</span>
												<span
													className={
														isHope
															? "text-xs text-gray-500"
															: "text-xs text-gray-400"
													}
												>
													{m.role === "OWNER" ? "オーナー" : "スタッフ"}
												</span>
												{sourceBadge}
												{/* {isAssignedOnly && (
                          <span className="text-xs text-blue-500 ml-2"></span>
                        )} */}
											</div>

											<div>
												{/* 希望時間帯表示（存在する場合） */}
												{hopeTime && hopeTime !== "anytime" && (
													<span
														className={
															isTimeMatch
																? "text-xs text-green01 ml-2 flex items-center gap-1"
																: "text-xs text-red-500 ml-2 flex items-center gap-1"
														}
													>
														<IoWarning
															className={isTimeMatch ? "hidden" : ""}
														/>
														<p className="">希望時間: {hopeTime}</p>
													</span>
												)}
												{hopeTime === "anytime" && (
													<span className="text-xs text-green-500 ml-2">
														いつでも可
													</span>
												)}
											</div>
										</div>
									</div>
									<input
										type="checkbox"
										className="checkbox checkbox-sm checkbox-success mr-2"
										checked={isChecked}
										onChange={(e) => {
											if (previewVacancies <= 0 && e.target.checked) return;
											if (e.target.checked) {
												setCheckedUids((prev) => [...prev, m.user.id]);
											} else {
												setCheckedUids((prev) =>
													prev.filter((uid) => uid !== m.user.id),
												);
											}
										}}
									/>
								</li>
							);
						})
					)}
				</ul>
				<div className="modal-action flex items-center gap-1 w-full">
					<button
						type="button"
						className="btn bg-gray02 text-white w-1/3 border-none"
						onClick={closeAssignStaffModal}
					>
						中止
					</button>
					<button
						type="submit"
						className={`btn w-2/3 border-none ${
							previewVacancies > 0
								? "bg-red-500 text-white"
								: "bg-green01 text-white"
						}`}
						onClick={(e) => {
							e.preventDefault();
							handleSave();
						}}
					>
						<LuUserRound className="text-lg" />
						{previewVacancies > 0 ? (
							<span className="ml-2">{`不足 ${previewVacancies}/${assignStaffData.count}`}</span>
						) : (
							<span className="ml-2">{`充足 ${checkedUids.length}/${assignStaffData.count}`}</span>
						)}
					</button>
				</div>
			</form>
		</dialog>
	);
};

export default AssignStaffModal;
