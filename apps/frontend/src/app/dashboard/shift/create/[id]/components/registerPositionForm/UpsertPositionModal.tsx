import type { RootState } from "@/redux/store";
import { UserLite } from "@shared/api/common/types/prismaLite";
import type { UpsertShiftPositionBaseInput } from "@shared/api/shiftPosition/validations/put-bulk";
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
import { useBulkUpsertJobroles } from "../../api/bulk-upsert-jobrole/hook";
import { useGetJobroles } from "../../api/get-jobroles-all/hook";
import { useCreateRequest } from "../../context/CreateRequestFormProvider";
import useRegisterPositionForm from "../../hook/useRegisterPositionForm";
import CountInput from "./CountInput";
import DatePickInput from "./DatePickInput";
import JobRoleInput from "./JobRoleInput";
import PriorityAndAbsoluteInput from "./PriorityAndAbsoluteInput";
import WeeksInput from "./WeeksInput";

const UpsertPositionModal = ({
	position,
	setPosition,
	editIndex,
}: {
	position: UpsertShiftPositionBaseInput;
	setPosition: React.Dispatch<
		React.SetStateAction<UpsertShiftPositionBaseInput>
	>;
	editIndex: number | null;
}) => {
	const { members } = useSelector((state: RootState) => state.members);
	const { handleGetJobroles } = useGetJobroles();
	const { shiftPositioins, setShiftPositions, allJobRoles, setAllJobRoles } =
		useCreateRequest();
	const { control, register, handleSubmit, getValues, setValue, errors } =
		useRegisterPositionForm({ initValue: position });

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
			setAllJobRoles(jobrolesOnlyName);
		})();
	}, [handleGetJobroles, setAllJobRoles]);

	const clearPosition = () => {
		setPosition({
			name: "",
			startTime: "",
			endTime: "",
			jobRoles: [],
			count: 1,
			weeks: [],
			absolute: [],
			priority: [],
		});
	};

	const closeUpsertPositionModal = () => {
		const modal = document.getElementById(
			`position_${position.name}`,
		) as HTMLDialogElement;
		if (modal) {
			modal.close();
		}
		clearPosition();
	};

	const onSubmitRegiserPosition = (data: UpsertShiftPositionBaseInput) => {
		const saveInputs: UpsertShiftPositionBaseInput = {
			name: data.name,
			startTime: data.startTime,
			endTime: data.endTime,
			count: data.count,
			weeks: data.weeks ?? [],
			jobRoles: data.jobRoles ?? [],
			absolute: data.absolute ?? [],
			priority: data.priority ?? [],
		};

		if (editIndex === null) {
			setShiftPositions((prev) => [...prev, saveInputs]); // ← 修正
		} else {
			setShiftPositions((prev) => {
				const next = [...prev];
				next[editIndex] = saveInputs;
				return next;
			});
		}

		closeUpsertPositionModal();
	};

	return (
		<dialog id={`position_${position.name}`} className="modal modal-bottom">
			<form
				onSubmit={handleSubmit(onSubmitRegiserPosition)}
				className="modal-box h-auto bg-white"
			>
				<input
					{...register("name")}
					className="w-full outline-none text-gray-600 font-bold"
					placeholder="ポジション名を入力（例：ホール担当)"
				/>
				{errors.name && (
					<span className="text-red-500 text-sm">{errors.name.message}</span>
				)}

				<div className="py-4">
					<div className="flex items-center  gap-6">
						<DatePickInput control={control} />
						<CountInput setValue={setValue} control={control} />
					</div>

					<WeeksInput control={control} errors={errors} />

					<JobRoleInput
						control={control}
						setValue={setValue}
						getValues={getValues}
						allJobRoles={allJobRoles}
						setAllJobRoles={setAllJobRoles}
					/>
					<PriorityAndAbsoluteInput control={control} />
				</div>
				<div className="modal-action flex items-center gap-1 w-full">
					<button
						type="button"
						className="btn bg-gray02 text-white w-1/3 border-none"
						onClick={() => {
							closeUpsertPositionModal();
						}}
					>
						中止
					</button>

					<button
						type="submit"
						className="btn bg-green01 text-white w-2/3 border-none"
					>
						<MdAdd className="text-lg" />
						{editIndex !== null ? "編集" : "追加"}
					</button>
				</div>
			</form>
		</dialog>
	);
};

export default UpsertPositionModal;
