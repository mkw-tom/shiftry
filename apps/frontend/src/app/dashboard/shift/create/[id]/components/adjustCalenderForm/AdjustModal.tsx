import type { RequestPositionWithDateInput } from "@shared/api/shift/request/validations/put";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useBulkUpsertJobroles } from "../../api/bulk-upsert-jobrole/hook";
import { useGetJobroles } from "../../api/get-jobroles-all/hook";
import { useCreateRequest } from "../../context/CreateRequestFormProvider";

import useAdjustPositionForm from "../../hook/useAdjustPositoinForm";
import CountInput from "./CountInput";
import DatePickInput from "./DatePickInput";
import AddJobRoleInput from "./JobRoleInput";
import JobRoleInput from "./JobRoleInput";
import SelectPriorityAndAbsolute from "./PriorityAndAbsoluteInput";
import PriorityAndAbsoluteInput from "./PriorityAndAbsoluteInput";

type Props = {
	time: string;
	date: string;
	editCalenderrPositon: RequestPositionWithDateInput;
	setEditCalendarPosition: React.Dispatch<
		React.SetStateAction<RequestPositionWithDateInput>
	>;
	mode: "new" | "adjust";
};

const AdjustPositionModal = ({
	time,
	date,
	editCalenderrPositon,
	setEditCalendarPosition,
	mode,
}: Props) => {
	const { setFormData, allJobRoles, setAllJobRoles } = useCreateRequest();
	const { control, register, handleSubmit, getValues, setValue, errors } =
		useAdjustPositionForm({ initValue: editCalenderrPositon });

	const closeAdjustCalenerPositionModal = () => {
		const modal = document.getElementById(
			`${date}-${editCalenderrPositon.name}`,
		) as HTMLDialogElement | null;
		modal?.close();

		setEditCalendarPosition({
			name: "",
			startTime: "",
			endTime: "",
			jobRoles: [],
			count: 1,
			priority: [],
			absolute: [],
		});
	};

	const onSubmitSaveCalderPosition = (data: RequestPositionWithDateInput) => {
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
			absolute: data.absolute ?? [],
			priority: data.priority ?? [],
		};

		setFormData((prev) => {
			const prevRequests = prev.requests ?? {};
			const day = { ...(prevRequests[date] ?? {}) };

			if (mode === "new") {
				// 同じ時間が既にあれば上書き（必要なら重複チェックしてreturnでもOK）
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
				requests: {
					...prevRequests,
					[date]: day,
				},
			};
		});

		// リセット＆クローズ
		setEditCalendarPosition({
			name: "",
			startTime: "",
			endTime: "",
			jobRoles: [],
			count: 1,
			priority: [],
			absolute: [],
		});
		closeAdjustCalenerPositionModal();
	};
	return (
		<dialog
			id={`${date}-${editCalenderrPositon.name}`}
			className="modal modal-bottom"
		>
			<form
				onSubmit={handleSubmit(onSubmitSaveCalderPosition)}
				className="modal-box h-auto bg-white"
			>
				<input
					{...register("name")}
					className="w-full outline-none text-gray-600 font-bold"
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

				<PriorityAndAbsoluteInput control={control} />

				<div className="modal-action flex items-center gap-1 w-full">
					<button
						type="button"
						className="btn bg-gray02 text-white w-1/3 border-none"
						onClick={() => {
							closeAdjustCalenerPositionModal();
						}}
					>
						中止
					</button>

					<button
						type="submit"
						className="btn bg-green01 text-white w-2/3 border-none"
					>
						<MdAdd className="text-lg" />
						{time === "new" ? "追加" : "編集"}
					</button>
				</div>
			</form>
		</dialog>
	);
};

export default AdjustPositionModal;
