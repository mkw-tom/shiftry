import type React from "react";
import { useEffect, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";

import type { AssignPositionWithDateInput } from "@shared/api/shift/assign/validations/put";
import { YMDW } from "@shared/utils/formatDate";
import { useAdjustShiftForm } from "../../context/AdjustShiftFormContextProvider.tsx";
import useEditAssignPositionForm from "../../hook/useAdjustAssignPosition";
import CountInput from "./CountInput";
import DatePickInput from "./DatePickInput";
import JobRoleInput from "./JobRoleInput";

type Props = {
	time: string;
	date: string;
	editAssignPosition: AssignPositionWithDateInput;
	setEditAssignPosition: React.Dispatch<
		React.SetStateAction<AssignPositionWithDateInput>
	>;
	mode: "new" | "adjust";
};

const EditAssignPositionModal = ({
	time,
	date,
	editAssignPosition,
	setEditAssignPosition,
	mode,
}: Props) => {
	const { assignShiftData, setAssignShiftData, allJobRoles, setAllJobRoles } =
		useAdjustShiftForm();
	const { control, register, handleSubmit, getValues, setValue, errors } =
		useEditAssignPositionForm({ initValue: editAssignPosition });

	const closeAdjustCalenerPositionModal = () => {
		if (mode === "new") {
			const modal = document.getElementById(
				"new-position-modal",
			) as HTMLDialogElement | null;
			modal?.close();
		} else {
			const modal = document.getElementById(
				`${date}-${editAssignPosition.name}`,
			) as HTMLDialogElement | null;
			modal?.close();
		}

		setEditAssignPosition({
			name: "",
			startTime: "",
			endTime: "",
			jobRoles: [],
			count: 1,
			assigned: [],
		});
	};

	const onSubmitSaveCalderPosition = (data: AssignPositionWithDateInput) => {
		const start = getValues("startTime");
		const end = getValues("endTime");
		if (!start || !end) {
			alert("開始時刻と終了時刻は必須です");
			return;
		}

		const editedTime = `${start}-${end}`;

		const payload = {
			name: data.name,
			count: data.count,
			jobRoles: data.jobRoles ?? [],
			assigned: (data.assigned ?? []).map((a) => ({
				...a,
				confirmed: a.confirmed ?? false,
			})),
		};

		setAssignShiftData((prev) => {
			const prevShifts = prev.shifts ?? {};
			const day = { ...(prevShifts[date] ?? {}) };

			if (mode === "new") {
				day[editedTime] = payload;
			} else {
				// mode === "adjust"
				if (time !== editedTime && day[time]) {
					delete day[time];
				}
				day[editedTime] = payload;
			}

			return {
				...prev,
				shifts: {
					...prevShifts,
					[date]: day,
				},
			};
		});
		closeAdjustCalenerPositionModal();
	};
	return (
		<dialog
			id={
				mode === "new"
					? "new-position-modal"
					: `${date}-${editAssignPosition.name}`
			}
			className="modal overflow-visible"
		>
			<form
				onSubmit={handleSubmit(onSubmitSaveCalderPosition)}
				className="modal-box h-auto bg-white overflow-visible"
			>
				<div className="flex items-center justify-between mb-2">
					<div className="text-gray02 font-bold">{YMDW(new Date(date))}</div>
					<button
						type="button"
						className="btn btn-sm btn-circle absolute right-2 top-2 shadow-none bg-white text-gray02 border border-gray02"
						onClick={() => closeAdjustCalenerPositionModal()}
					>
						✕
					</button>
				</div>
				<input
					{...register("name")}
					className="text-lg w-full outline-none text-gray-600 font-bold"
					placeholder="ポジション名を入力（例：ホール担当)"
				/>
				{errors.name && (
					<p className="text-sm text-error mt-1">{errors.name.message}</p>
				)}

				<div className="py-4">
					<div className="flex items-center gap-6">
						<DatePickInput control={control} />
						<CountInput setValue={setValue} control={control} />
					</div>

					<JobRoleInput
						control={control}
						getValues={getValues}
						setValue={setValue}
						allJobRoles={allJobRoles}
						setAllJobRoles={setAllJobRoles}
					/>
				</div>

				<div className="modal-action flex items-center gap-1 w-full">
					<button
						type="submit"
						className="btn bg-green01 text-white w-full border-none shadow-sm"
					>
						<MdAdd className="text-lg" />
						{mode === "new" ? "追加" : "編集"}
					</button>
				</div>
			</form>
		</dialog>
	);
};

export default EditAssignPositionModal;
