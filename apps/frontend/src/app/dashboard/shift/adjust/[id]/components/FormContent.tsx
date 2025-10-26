"use client";
import { useGetStaffPreferenceAll } from "@/app/api/hook/staffPreference/useGetStaffPreferenceAll";
import { useGetAssignShfit } from "@/app/api/hook/useGetAssignShift";
import { useGetShiftRequestSpecific } from "@/app/api/hook/useGetShiftRequestSpecific";
import { useGetSubmittedShfit } from "@/app/api/hook/useGetSubmittedShfit";
import {
	demoAssignShift,
	demoMembers,
	demoSubmissions,
	demoTemplateShift,
	dummyStaffPreferences,
} from "@/app/utils/dummyData/aiAdjustDemo";
import { TEST_MODE } from "@/lib/env";
import { setMembers } from "@/redux/slices/members";
import type { RootState } from "@/redux/store";
import type {
	AssignPositionWithDateInput,
	ShiftsOfAssignType,
} from "@shared/api/shift/assign/validations/put";
import React, { useState, useEffect, useCallback } from "react";
import { MdErrorOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";
import { useViewSwitch } from "../context/ViewSwitchProvider";
import AssignPositionList from "./AssignPositionList";
import FormHead from "./FormHead";
import ShiftControlButtons from "./ShiftControlButtons";
import ShiftTableView from "./ShiftTableView";
import Table from "./Table";
import EditAssignPositionModal from "./modals/EditAssignPositionModal";

const FormContent = ({ shiftRequestId }: { shiftRequestId: string }) => {
	const { viewMode } = useViewSwitch();
	const { user } = useSelector((state: RootState) => state.user);
	const {
		shiftRequestData,
		setShiftRequestData,
		setAssignShiftData,
		setSubmittedShiftList,
		setStaffPreferences,
	} = useAdjustShiftForm();
	const [editAssignPosition, setEditAssignPosition] =
		useState<AssignPositionWithDateInput>({
			name: "",
			startTime: "",
			endTime: "",
			count: 0,
			jobRoles: [],
			assigned: [],
		});

	const {
		getShiftRequestSpecific,
		isLoading: srLoading,
		error: srError,
	} = useGetShiftRequestSpecific();
	const {
		getAssignShift,
		isLoading: asLoading,
		error: asError,
	} = useGetAssignShfit();
	const {
		getSubmittedShfit,
		isLoading: ssLoading,
		error: ssError,
	} = useGetSubmittedShfit();
	const {
		getStaffPreferenceAll,
		isLoading: spLoading,
		error: spError,
	} = useGetStaffPreferenceAll();

	const isLoading = srLoading || asLoading || ssLoading || spLoading;
	const isError = srError || asError || ssError || spError;
	const dispatch = useDispatch();

	// 初回のみ: shiftRequestData, assignShiftData, submittedShiftListを取得し、assignShiftDataのマージも初回のみ実行

	useEffect(() => {
		let isMounted = true;

		const fetchTestModeData = () => {
			if (!TEST_MODE) return;
			setShiftRequestData(demoTemplateShift);
			setAssignShiftData(demoAssignShift);
			setSubmittedShiftList(demoSubmissions);
			setStaffPreferences(dummyStaffPreferences);
			dispatch(setMembers(demoMembers));
		};

		const fetchShiftData = async () => {
			if (TEST_MODE) return;
			// 1. shiftRequestData取得
			const srRes = await getShiftRequestSpecific({ shiftRequestId });
			if (isMounted && srRes.ok) {
				setShiftRequestData((prev) => ({
					id: srRes.shiftRequest.id,
					type: srRes.shiftRequest.type,
					storeId: srRes.shiftRequest.storeId,
					requests: srRes.shiftRequest.requests,
					status: srRes.shiftRequest.status,
					weekStart: new Date(srRes.shiftRequest.weekStart as Date),
					weekEnd: new Date(srRes.shiftRequest.weekEnd as Date),
					deadline: new Date(srRes.shiftRequest.deadline as Date),
					createdAt: new Date(srRes.shiftRequest.createdAt as Date),
					updatedAt: new Date(srRes.shiftRequest.updatedAt as Date),
				}));

				// 2. assignShiftData取得＋shiftRequestData.requestsとマージ
				const asRes = await getAssignShift({ shiftRequestId });
				if (asRes.ok) {
					const shiftRequest = srRes.shiftRequest;
					if (!asRes.assignShift) {
						const newShifts = Object.entries(shiftRequest.requests).reduce(
							(acc, [date, times]) => {
								if (!acc[date]) acc[date] = {};
								if (times) {
									Object.entries(times).map(([time, pos]) => {
										if (!pos) return;
										acc[date][time] = {
											name: pos.name,
											count: pos.count,
											jobRoles: [],
											assigned: [],
											assignedCount: 0,
											vacancies: pos.count,
											status: "draft",
										};
									});
								}
								return acc;
							},
							{} as ShiftsOfAssignType,
						);

						setAssignShiftData((prev) => ({
							...prev,
							storeId: shiftRequest.storeId,
							shiftRequestId: shiftRequestId,
							shifts: newShifts,
						}));
					}

					if (asRes.assignShift) {
						const prevAssign = asRes.assignShift;
						const newShifts = { ...prevAssign.shifts };
						Object.entries(shiftRequest.requests).map(([date, times]) => {
							if (!times) return;
							if (!newShifts[date]) newShifts[date] = {};
							Object.entries(times).map(([time, pos]) => {
								if (!pos) return;
								if (!newShifts[date][time]) {
									newShifts[date][time] = {
										name: pos.name,
										count: pos.count,
										jobRoles: [],
										assigned: [],
										assignedCount: 0,
										vacancies: pos.count,
										status: "draft",
									};
								} else {
									newShifts[date][time].name = pos.name;
									newShifts[date][time].count = pos.count;
								}
							});
						});
						setAssignShiftData({ ...prevAssign, shifts: newShifts });
					}
				} else {
					alert(
						`割り当てデータの読み込みに失敗しました。error：${asRes.message}`,
					);
				}
			} else if (isMounted && "message" in srRes) {
				alert(
					`雛形データのう読み込みに失敗したmongodbした。error：${srRes.message}`,
				);
			}

			// 3. submittedShiftList取得
			const ssRes = await getSubmittedShfit({ shiftRequestId });
			if (isMounted && ssRes.ok) {
				setSubmittedShiftList(() => {
					const parsedDatas = ssRes.submittedShifts.map((submission) => {
						return {
							...submission,
							createdAt: new Date(submission.createdAt),
							updatedAt: new Date(submission.updatedAt),
						};
					});
					return parsedDatas;
				});
			} else if (isMounted && "message" in ssRes) {
				alert(`提出データの取得に失敗しました。error:${ssRes.message}`);
			}

			// 4. staffPreferences取得
			const spRes = await getStaffPreferenceAll();
			if (isMounted && spRes.ok) {
				setStaffPreferences(() => {
					const parsedDatas = spRes.staffPreferences.map((pref) => {
						return {
							...pref,
							createdAt: new Date(pref.createdAt),
							updatedAt: new Date(pref.updatedAt),
						};
					});
					return parsedDatas;
				});
			} else if (isMounted && "message" in spRes) {
				alert(`スタッフ希望情報の取得に失敗しました。error:${spRes.message}`);
			}
		};

		fetchTestModeData();
		fetchShiftData();
		return () => {
			isMounted = false;
		};
	}, [
		getStaffPreferenceAll,
		getShiftRequestSpecific,
		getAssignShift,
		getSubmittedShfit,
		setStaffPreferences,
		setShiftRequestData,
		setAssignShiftData,
		setSubmittedShiftList,
		shiftRequestId,
		dispatch,
	]);

	const openSubmitStatusModal = () => {
		const modal = document.getElementById(
			"submit-status",
		) as HTMLDialogElement | null;
		if (modal) modal.showModal();
	};

	const openEditAssignPositionModal = (
		position: AssignPositionWithDateInput,
		date: string,
		mode: "new" | "adjust",
	) => {
		setEditAssignPosition({
			name: position.name,
			startTime: position.startTime,
			endTime: position.endTime,
			count: position.count,
			jobRoles: position.jobRoles || [],
			assigned: position.assigned || [],
		});

		setTimeout(() => {
			if (mode === "new") {
				const modal = document.getElementById("new-position-modal");
				if (modal) {
					(modal as HTMLDialogElement).showModal();
				}
			} else {
				const modal = document.getElementById(`${date}-${position.name}`);
				if (modal) {
					(modal as HTMLDialogElement).showModal();
				}
			}
		}, 0);
	};

	const dateFullRange = (): Date[] => {
		if (!shiftRequestData) return [];
		const start = new Date(shiftRequestData.weekStart);
		const end = new Date(shiftRequestData.weekEnd);
		const dates: Date[] = [];
		if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
			return dates;
		const current = new Date(start);
		while (current <= end) {
			dates.push(new Date(current)); // コピーを入れる
			current.setDate(current.getDate() + 1);
		}
		return dates;
	};

	const [daysSplitIndex, setDaysSplitIndex] = useState<number>(0);
	const daysWithSevenDays = dateFullRange().slice(
		daysSplitIndex * 7,
		7 * (daysSplitIndex + 1),
	);
	const [selectDate, setSelectDate] = useState<Date>(
		daysWithSevenDays[0] ?? new Date(shiftRequestData.weekStart),
	);

	if (isError) {
		return (
			<div className="w-full flex flex-col items-center gap-2 pt-16">
				<MdErrorOutline className="text-gray02 text-2xl mt-20" />
				<p className="text-center text-gray02 font-bold tracking-wide">
					通信エラーが発生しました
					<br />
					{ssError && `提出データ：${ssError}`}
					{srError && `雛形データ：${srError}`}
					{asError && `割当データ：${asError}`}
				</p>
			</div>
		);
	}
	if (shiftRequestData.id === "" || isLoading) {
		return (
			<div className="w-full flex flex-col items-center gap-2 pt-20">
				<p className="loading loading-spinner text-green02" />
				<p className="text-center text-green02 tracking-wide mt-2">
					読み込み中...
				</p>
			</div>
		);
	}

	if (viewMode === "table") {
		return (
			<div>
				<FormHead />
				<ShiftTableView />
			</div>
		);
	}

	return (
		<div>
			<FormHead />
			<Table
				dateFullRange={dateFullRange}
				daysSplitIndex={daysSplitIndex}
				setDaysSplitIndex={setDaysSplitIndex}
				daysWithSevenDays={daysWithSevenDays}
				selectDate={selectDate}
				setSelectDate={setSelectDate}
			/>
			<EditAssignPositionModal
				date={selectDate ? selectDate.toISOString().slice(0, 10) : ""}
				time={""}
				editAssignPosition={editAssignPosition}
				setEditAssignPosition={setEditAssignPosition}
				mode="new"
			/>

			{user?.role !== "STAFF" && (
				<ShiftControlButtons
					selectDate={selectDate}
					openEditAssignPositionModal={openEditAssignPositionModal}
					openSubmitStatusModal={openSubmitStatusModal}
					editAssignPosition={editAssignPosition}
				/>
			)}

			<AssignPositionList
				selectDate={selectDate}
				editAssignPosition={editAssignPosition}
				setEditAssignPosition={setEditAssignPosition}
				openEditAssignPositionModal={openEditAssignPositionModal}
			/>
		</div>
	);
};

export default FormContent;
