import { dummySubmittedShiftList } from "@/app/utils/dummyData/SubmittedShifts";
import type { RootState } from "@/redux/store.js";
import type { StaffPreferenceDTO } from "@shared/api/staffPreference/dto";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAdjustShiftForm } from "../../context/AdjustShiftFormContextProvider.tsx";
import CreateEditStaffPreferenceModal from "./CreateEditStaffPreferenceModal";
import NotSubmitList from "./NotSubmitList";
import PreferenceControlNav from "./PreferenceControlNav";
import PreferenceList from "./PreferenceList";
import SubmitList from "./SubmitList";
import SubmitStaffInfoModal from "./SubmitStaffInfoModal";
import SubmitStatusHead from "./SubmitStatusHead";
import SubmitStatusTubs from "./SubmitStatusTubs";

const SubmitStatusModal = ({
	id = "submit-status",
	startDate,
	endDate,
}: {
	id: string;
	startDate: Date;
	endDate: Date;
}) => {
	const { members } = useSelector((state: RootState) => state.members);
	console.log("members in SubmitStatusModal:", members);
	const { submittedShiftList, staffPreferences } = useAdjustShiftForm();
	const submittedIds = submittedShiftList.map((s) => s.userId);

	const submittedMembers = members.filter((m) =>
		submittedIds.includes(m.user.id),
	);
	const notSubmittedMembers = members.filter(
		(m) => !submittedIds.includes(m.user.id),
	);

	const [tab, setTab] = useState<
		"submitted" | "notSubmitted" | "staffPreference"
	>("submitted");

	const [infoUserId, setInfoUserId] = useState<string | null>(null);

	const [preferenceInfo, setPreferenceInfo] = useState<
		Pick<
			StaffPreferenceDTO,
			"userId" | "weekMax" | "weekMin" | "weeklyAvailability"
		> & { userName: string }
	>({
		userId: "",
		userName: "",
		weekMin: 1,
		weekMax: 1,
		weeklyAvailability: {
			mon: "anytime",
			tue: "anytime",
			wed: "anytime",
			thu: "anytime",
			fri: "anytime",
			sat: "anytime",
			sun: "anytime",
		},
	});

	const openSubmitStaffInfoModal = (userId: string) => {
		setInfoUserId(userId);
		setTimeout(() => {
			const modal = document.getElementById(
				`submit-info-modal-${userId}`,
			) as HTMLDialogElement | null;
			modal?.showModal();
		}, 100);
	};
	const closeSubmitStaffInfoModal = () => {
		const modal = document.getElementById(
			`submit-info-modal-${infoUserId}`,
		) as HTMLDialogElement | null;
		modal?.close();
		setInfoUserId(null);
	};

	const openStaffPreferenceModal = (userId?: string, userName?: string) => {
		if (userId && userName) {
			const data = staffPreferences.find((pref) => pref.userId === userId);
			if (!data) {
				return;
			}
			setPreferenceInfo({
				userId: data.userId,
				userName: userName,
				weekMin: data.weekMin,
				weekMax: data.weekMax,
				weeklyAvailability: Object.fromEntries(
					Object.entries(data.weeklyAvailability).map(([k, v]) => [k, v ?? ""]),
				),
			});
		}
		const modal = document.getElementById(
			`staff-preference-modal-${preferenceInfo.userId}`,
		) as HTMLDialogElement | null;
		modal?.showModal();
	};
	const closeStaffPreferenceModal = () => {
		const modal = document.getElementById(
			`staff-preference-modal-${preferenceInfo.userId}`,
		) as HTMLDialogElement | null;
		modal?.close();

		setPreferenceInfo({
			userId: "",
			userName: "",
			weekMin: 1,
			weekMax: 1,
			weeklyAvailability: {
				mon: "anytime",
				tue: "anytime",
				wed: "anytime",
				thu: "anytime",
				fri: "anytime",
				sat: "anytime",
				sun: "anytime",
			},
		});
	};

	const onClose = () => {
		const modal = document.getElementById(id) as HTMLDialogElement | null;
		modal?.close();
	};

	return (
		<>
			<CreateEditStaffPreferenceModal
				onClose={closeStaffPreferenceModal}
				preferenceInfo={preferenceInfo}
			/>
			<SubmitStaffInfoModal
				onClose={closeSubmitStaffInfoModal}
				userId={infoUserId}
			/>
			<dialog id={id} className="modal modal-bottom">
				<div className="modal-box h-[600px] flex flex-col bg-white">
					<SubmitStatusHead
						startDate={startDate}
						endDate={endDate}
						onClose={onClose}
					/>
					<SubmitStatusTubs
						tab={tab}
						setTab={setTab}
						submittedMembers={submittedMembers}
						notSubmittedMembers={notSubmittedMembers}
					/>
					{tab === "staffPreference" && (
						<PreferenceControlNav
							openStaffPreferenceModal={openStaffPreferenceModal}
						/>
					)}

					{/* スクロール制限付きリスト */}
					<div className="py-2 px-2 flex-1 overflow-y-auto">
						{tab === "submitted" && (
							<SubmitList
								members={submittedMembers}
								submittedShiftList={dummySubmittedShiftList}
								onOpenInfo={openSubmitStaffInfoModal}
							/>
						)}
						{tab === "notSubmitted" && (
							<NotSubmitList members={notSubmittedMembers} />
						)}
						{tab === "staffPreference" && (
							<PreferenceList
								members={members}
								staffPreferences={staffPreferences}
								onEdit={openStaffPreferenceModal}
							/>
						)}
					</div>
				</div>
			</dialog>
		</>
	);
};

export default SubmitStatusModal;
