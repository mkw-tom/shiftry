"use client";
import { useGetAssignShfit } from "@/app/api/hook/useGetAssignShift";
import { useGetShiftRequestSpecific } from "@/app/api/hook/useGetShiftRequestSpecific";
import { useGetSubmittedShfit } from "@/app/api/hook/useGetSubmittedShfit";
import type {
	AssignPositionType,
	AssignPositionWithDateInput,
	ShiftsOfAssignType,
} from "@shared/api/shift/assign/validations/put";
import React, { useState, useEffect, useCallback } from "react";
import { BiError } from "react-icons/bi";
import { LuSend } from "react-icons/lu";
import { MdAdd, MdErrorOutline } from "react-icons/md";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";
import AssignPositionList from "./AssignPositionList";
import FormHead from "./FormHead";
import Table from "./Table";
import AutoAssignModal from "./modals/AutoAssignModal";
import EditAssignPositionModal from "./modals/EditAssignPositionModal";
import SubmitStatusModal from "./modals/SubmitStatusModal";

const FormContent = ({ shiftRequestId }: { shiftRequestId: string }) => {
	const {
		shiftRequestData,
		setShiftRequestData,
		setAssignShiftData,
		setSubmittedShiftList,
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
	const isLoading = srLoading || asLoading || ssLoading;
	const isError = srError || asError || ssError;

	// 初回のみ: shiftRequestData, assignShiftData, submittedShiftListを取得し、assignShiftDataのマージも初回のみ実行
	useEffect(() => {
		let isMounted = true;
		const fetchShiftData = async () => {
			// 1. shiftRequestData取得
			const srRes = await getShiftRequestSpecific({ shiftRequestId });
			if (isMounted && srRes.ok) {
				setShiftRequestData({
					...srRes.shiftRequest,
					weekStart: new Date(srRes.shiftRequest.weekStart as Date),
					weekEnd: new Date(srRes.shiftRequest.weekEnd as Date),
					deadline: new Date(srRes.shiftRequest.deadline as Date),
					createdAt: new Date(srRes.shiftRequest.createdAt as Date),
					updatedAt: new Date(srRes.shiftRequest.updatedAt as Date),
				});
				// 2. assignShiftData取得
				const asRes = await getAssignShift({ shiftRequestId });
				if (asRes.ok) {
					// assignShiftDataにshiftRequestData.requestsのname/countをマージ
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
							shifts: newShifts,
						}));

						return;
					}

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
				} else {
					console.error(asRes.message);
				}
			} else if (isMounted && "message" in srRes) {
				console.error(srRes.message);
			}

			// 3. submittedShiftList取得
			const ssRes = await getSubmittedShfit({ shiftRequestId });
			if (isMounted && ssRes.ok) {
				setSubmittedShiftList(ssRes.submittedShifts);
			} else if (isMounted && "message" in ssRes) {
				console.error(ssRes.message);
			}
		};
		fetchShiftData();
		return () => {
			isMounted = false;
		};
	}, [
		getShiftRequestSpecific,
		getAssignShift,
		getSubmittedShfit,
		setShiftRequestData,
		setAssignShiftData,
		setSubmittedShiftList,
		shiftRequestId,
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
	) => {
		const modal = document.getElementById(`${date}-${position.name}`);
		if (modal) {
			(modal as HTMLDialogElement).showModal();
		}
		setEditAssignPosition({
			name: position.name,
			startTime: position.startTime,
			endTime: position.endTime,
			count: position.count,
			jobRoles: position.jobRoles || [],
			assigned: position.assigned || [],
		});
	};

	const openAutoAssignModal = (id: string) => {
		const modal = document.getElementById(`auto-assign-${id}`);
		if (modal) {
			(modal as HTMLDialogElement).showModal();
		}
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
	const [selectDate, setSelectDate] = useState<Date>(daysWithSevenDays[0]);

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
			<div className="w-full flex gap-1 items-center justify-center shadow-sm  p-1 bg-white">
				<button
					type="button"
					className="btn btn-sm bg-white text-green01 font-bold flex-1 border-dashed border-1 border-gray01 shadow-none"
					onClick={() =>
						openEditAssignPositionModal(editAssignPosition, String(selectDate))
					}
				>
					<MdAdd className="text-lg" />
					ポジションを追加
				</button>

				<AutoAssignModal />
				<button
					type="button"
					className="btn btn-sm  border-green01 text-green01 font-bold bg-white shadow-none"
					onClick={() => openAutoAssignModal(shiftRequestData.id)}
				>
					{/* <AiOutlineOpenAI className="text-[14px]"/> */}
					自動割当
				</button>
				{/* <button className="btn btn-sm  border-green01 text-green01 font-bold bg-white shadow-none">
          <AiOutlineOpenAI className="text-[14px]"/>
          AI提案
        </button> */}
				<button
					type="button"
					className="btn btn-sm border-gray02 text-gray02 font-bold bg-white shadow-none"
					onClick={openSubmitStatusModal}
				>
					提出状況
				</button>
				<SubmitStatusModal
					id="submit-status"
					startDate={shiftRequestData.weekStart}
					endDate={shiftRequestData.weekEnd}
				/>
			</div>
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
