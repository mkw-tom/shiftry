import type { UpsertSubmittedShiftInputType } from "@shared/api/shift/submit/validations/put";
import React, { type Dispatch, type SetStateAction } from "react";

const WeekCountForm = ({
	formData,
	setFormData,
}: {
	formData: UpsertSubmittedShiftInputType;
	setFormData: Dispatch<SetStateAction<UpsertSubmittedShiftInputType>>;
}) => {
	function InputWeekCount(value: string, kind: "min" | "max") {
		const num = Number(value);
		if (Number.isNaN(num)) return; // 数値でなければ無視

		setFormData((prev) => ({
			...prev,
			shifts: {
				...prev.shifts,
				weekCountMin: kind === "min" ? num : prev.shifts.weekCountMin,
				weekCountMax: kind === "max" ? num : prev.shifts.weekCountMax,
			},
		}));
	}

	return (
		<div className=" text-black  w-full flex flex-col">
			<span className="text-md font-thin opacity-70 tabular-nums text-black ">
				① 出勤回数（週）
			</span>
			<div className="flex items-center gap-5">
				<label className="text-sm">
					<span className="text-sm pl-1 opacity-70 tabular-nums text-black">
						最低
					</span>
					<input
						type="number"
						className="input validator bg-gray01"
						value={
							formData.shifts.weekCountMin === 0
								? ""
								: formData.shifts.weekCountMin
						}
						required
						placeholder="半角英数"
						min="1"
						max="20"
						title="Must be between be 1 to 10"
						onChange={(e) => InputWeekCount(e.target.value, "min")}
					/>
					<p className="validator-hint">半角英数で入力してください</p>
				</label>
				<label>
					<span className="text-sm pl-1 opacity-70 tabular-nums text-black">
						最大
					</span>
					<input
						type="number"
						className="input validator bg-gray01"
						value={
							formData.shifts.weekCountMax === 0
								? ""
								: formData.shifts.weekCountMax
						}
						required
						placeholder="半角英数"
						min="1"
						max="20"
						title="Must be between be 1 to 10"
						onChange={(e) => InputWeekCount(e.target.value, "max")}
					/>
					<p className="validator-hint">半角英数で入力してください</p>
				</label>
			</div>
		</div>
	);
};

export default WeekCountForm;
