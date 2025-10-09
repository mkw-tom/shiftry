import { dummySubmittedShiftList } from "@/app/utils/dummyData/SubmittedShifts";
// import { dummyMembers } from "@/app/utils/dummyData/member";
import { formatTimeRangeHHmm } from "@/app/utils/times";
import type { RootState } from "@/redux/store.js";
import {
	type AssignPositionType,
	AssignPositionWithDateInput,
} from "@shared/api/shift/assign/validations/put";
import type { SubmittedShiftDTO } from "@shared/api/shift/submit/dto";
import { YMDW } from "@shared/utils/formatDate";
import React, { useEffect } from "react";
import { IoWarning } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useAdjustShiftForm } from "../../context/AdjustShiftFormContextProvider.tsx";
import SuggestedAssinStaffList from "./SuggestedAssinStaffList";

const AiSuggestionModal = ({
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

	const [aiSuggestedMembersSubmit, setAiSuggestedMembersSubmit] =
		React.useState<SubmittedShiftDTO[]>([]);
	const [suggetstedloading, setSuggetstedloading] =
		React.useState<boolean>(false);

	const initialAssigned = (assignStaffData.assigned ?? []).map((a) => a.uid);
	const [checkedUids, setCheckedUids] =
		React.useState<string[]>(initialAssigned);

	useEffect(() => {
		setSuggetstedloading(true);
		setCheckedUids((assignStaffData.assigned ?? []).map((a) => a.uid));
		const aiSuggestRes = dummySubmittedShiftList;
		setAiSuggestedMembersSubmit(aiSuggestRes);
		setTimeout(() => {
			setSuggetstedloading(false);
		}, 5000);
	}, [assignStaffData]);

	const closeAiSuggestionModal = () => {
		const modal = document.getElementById(
			`${date}-${time}-${assignStaffData.name}-ai-suggestion-modal`,
		) as HTMLDialogElement | null;
		modal?.close();
	};

	const handleSave = () => {
		const modal = document.getElementById(
			`${date}-${time}-${assignStaffData.name}-ai-suggestion-modal`,
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
	};

	const AiSuggestedStaffIds = aiSuggestedMembersSubmit.map((sub) => sub.userId);

	const { members } = useSelector((state: RootState) => state.members);

	const assignedMembers = members.filter((m) =>
		(assignShiftData.shifts?.[date]?.[time]?.assigned ?? []).some(
			(a) => a.uid === m.user.id,
		),
	);

	const previewVacancies = assignStaffData.count - checkedUids.length;

	const allMemberIds = Array.from(
		new Set([
			...AiSuggestedStaffIds,
			...members.map((m) => m.user.id),
			...assignedMembers.map((m) => m.user.id),
		]),
	);
	const allMembers = allMemberIds
		.map((id) => members.find((m) => m.user.id === id))
		.filter(Boolean);

	return (
		<dialog
			id={`${date}-${time}-${assignStaffData.name}-ai-suggestion-modal`}
			className="modal"
		>
			<form className="modal-box h-auto  bg-white">
				<h2 className="font-bold text-purple-500 ">AI調整</h2>
				<div className=" text-gray-600 font-bold mb-2">
					{YMDW(new Date(date))}
				</div>
				<h3 className="font-bold text-green02 mb-3 ml-1">
					{assignStaffData.name}
				</h3>
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

				{suggetstedloading ? (
					<div className="w-full flex flex-col items-center justify-center gap-2 my-10">
						<div className="loading loading-spinner loading-lg text-purple-500" />
						<p className="text-gray-500 text-sm">AIが候補者を選出中...</p>
					</div>
				) : (
					<SuggestedAssinStaffList
						allMembers={allMembers}
						checkedUids={checkedUids}
						setCheckedUids={setCheckedUids}
						time={time}
						date={date}
						AiSuggestedStaffIds={AiSuggestedStaffIds}
						previewVacancies={previewVacancies}
					/>
				)}

				<div className="modal-action flex items-center gap-1 w-full">
					<button
						type="button"
						className="btn bg-gray02 text-white w-1/3 border-none"
						onClick={closeAiSuggestionModal}
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
						disabled={suggetstedloading}
					>
						<LuUserRound className="text-lg" />
						{previewVacancies > 0 ? (
							<span className="ml-2">{`不足 ${checkedUids.length}/${assignStaffData.count}`}</span>
						) : (
							<span className="ml-2">{`充足 ${checkedUids.length}/${assignStaffData.count}`}</span>
						)}
					</button>
				</div>
			</form>
		</dialog>
	);
};

export default AiSuggestionModal;
