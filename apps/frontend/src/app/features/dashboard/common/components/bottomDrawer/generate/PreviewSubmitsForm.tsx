import { useMembersHook } from "@/app/features/common/api/get-members/hook";
import type { RootState } from "@/app/redux/store";
import type { shiftsOfSubmittedType } from "@shared/common/types/json";
import type { SubmittedShift, User } from "@shared/common/types/prisma";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetSubmittedShiftsSpecific } from "../../../api/get-shift-submit-specific/hook";
import { useBottomDrawer } from "../../../context/useBottomDrawer";
import GenerateShiftButton from "./GenareteShiftButton";
import NotSubmitShiftList from "./NotSubmitShiftList";
import StatusHeadSwitch from "./StatusHeadSwitch";
import StepBar from "./StepBar";
import SubmittedShiftList from "./SubmittedShiftLIst";

export type SubmittedShiftWithJson = Omit<SubmittedShift, "shifts"> & {
	shifts: shiftsOfSubmittedType;
};

export type SubmitStatusDataType = {
	submittedShifts: SubmittedShiftWithJson[];
	notSubmittedShifts: User[];
};

const PreviewSubmitsForm = () => {
	const [select, setSelect] = useState<"SUBMITTED" | "NOT_SUBMIT">("SUBMITTED");
	const { userToken, storeToken } = useSelector(
		(state: RootState) => state.token,
	);
	const { members } = useSelector((state: RootState) => state.members);
	const { currentData } = useBottomDrawer();
	const {
		handleGetSubmitShiftsSpecific,
		isLoading: isLoadingGetSubmitShiftsSpecific,
		error: errorGetSubmitShiftsSpecific,
	} = useGetSubmittedShiftsSpecific();
	const { error: errorMembers, isLoading: isLoadingMembers } =
		useMembersHook(true);

	const [submitStatusData, setSubmitStatusData] =
		useState<SubmitStatusDataType>({
			submittedShifts: [],
			notSubmittedShifts: [],
		});
	console.log(submitStatusData, errorMembers);
	useEffect(() => {
		const fetchData = async () => {
			if (!userToken || !storeToken || !currentData?.id) {
				alert("情報が不足しています");
				return;
			}
			const res = await handleGetSubmitShiftsSpecific(currentData.id);
			if (res?.ok) {
				const notSubmitShiftUsers = members.filter(
					(member) =>
						!res.submittedShifts.some(
							(submittedShift) => submittedShift.userId === member.id,
						),
				);
				setSubmitStatusData({
					submittedShifts: res.submittedShifts as SubmittedShiftWithJson[],
					notSubmittedShifts: notSubmitShiftUsers,
				});
			}
		};
		fetchData();
	}, [
		userToken,
		storeToken,
		currentData?.id,
		handleGetSubmitShiftsSpecific,
		members,
	]);

	return (
		<div>
			{isLoadingGetSubmitShiftsSpecific ||
				(isLoadingMembers && (
					<div className="text-center mt-10">
						<div className="loading loading-spinner loading-sm text-gray-400 mx-auto" />
						<p className="text-xs text-gray-500 mt-2">読み込み中...</p>
					</div>
				))}
			<StatusHeadSwitch
				select={select}
				setSelect={setSelect}
				submittedCount={submitStatusData.submittedShifts.length}
				notSubmittedCount={submitStatusData.notSubmittedShifts.length}
			/>
			<div className="h-[410px] pb-56 overflow-y-auto">
				<div className="flex gap-1 flex-col px-2 pt-4">
					{select === "SUBMITTED" && (
						<SubmittedShiftList
							submittedShifts={submitStatusData.submittedShifts}
						/>
					)}
					{select === "NOT_SUBMIT" && (
						<NotSubmitShiftList
							notSubmittedShifts={submitStatusData.notSubmittedShifts}
						/>
					)}
				</div>
			</div>
			{/* <GenerateShiftButton /> */}
		</div>
	);
};

export default PreviewSubmitsForm;
