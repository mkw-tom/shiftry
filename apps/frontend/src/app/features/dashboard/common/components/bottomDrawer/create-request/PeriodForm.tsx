import type { ShiftType } from "@shared/common/types/prisma";
import type React from "react";
import { useCreateRequest } from "../../../context/useCreateRequest";

const PeriodForm = () => {
	const { setFormData, formData } = useCreateRequest();
	const now = new Date();
	const today = now.toISOString().split("T")[0];
	const nowDateTime = now.toISOString().slice(0, 16);

	const maxDeadline = formData.weekStart
		? (() => {
				const date = new Date(formData.weekStart);
				date.setDate(date.getDate() - 1);
				return `${date.toISOString().slice(0, 10)}T23:59`;
			})()
		: undefined;

	function selectShiftType(type: ShiftType) {
		setFormData((prev) => ({
			...prev,
			type: type,
			weekStart: "",
			weekEnd: "",
			deadline: "",
		}));
	}

	function selectWeekStart(e: React.ChangeEvent<HTMLInputElement>) {
		const startDate = e.target.value;
		let updatedWeekEnd = formData.weekEnd;

		if (formData.type === "WEEKLY") {
			const start = new Date(startDate);
			const end = new Date(start);
			end.setDate(end.getDate() + 6);
			updatedWeekEnd = end.toISOString().split("T")[0]; // "YYYY-MM-DD"
		}
		if (formData.type === "MONTHLY") {
			const start = new Date(startDate);
			const end = new Date(start.getFullYear(), start.getMonth() + 1, 0); // 月末日
			updatedWeekEnd = end.toISOString().split("T")[0];
		}

		setFormData((prev) => ({
			...prev,
			weekStart: startDate,
			weekEnd: updatedWeekEnd,
		}));
	}

	function selectWeekEnd(e: React.ChangeEvent<HTMLInputElement>) {
		setFormData((prev) => ({
			...prev,
			weekEnd: e.target.value,
		}));
	}

	function selectLimitData(e: React.ChangeEvent<HTMLInputElement>) {
		setFormData((prev) => ({
			...prev,
			deadline: e.target.value,
		}));
	}

	return (
		<div className="w-full h-[400px] mt-3">
			<div className="flex flex-col gap-5">
				<div className="flex  gap-1 flex-col px-2">
					<span className="text-md font-thin opacity-70 tabular-nums text-black ">
						タイプ
					</span>
					<div className="flex gap-5 pl-3">
						<label htmlFor="weekly" className="flex items-center gap-1">
							<input
								id="weekly"
								type="radio"
								name="radio-9"
								className="radio radio-sm radio-success "
								checked={formData.type === "WEEKLY"}
								onChange={(e) => selectShiftType("WEEKLY")}
							/>
							<span className="text-md font-thin opacity-70 tabular-nums text-black ">
								1週間
							</span>
						</label>
						<label htmlFor="monthly" className="flex items-center gap-1">
							<input
								id="monthly"
								type="radio"
								name="radio-9"
								className="radio radio-sm radio-success "
								checked={formData.type === "MONTHLY"}
								onChange={() => selectShiftType("MONTHLY")}
							/>
							<span className="text-md font-thin opacity-70 tabular-nums text-black ">
								1ヶ月
							</span>
						</label>
					</div>
				</div>

				<div className="flex gap-1 flex-col px-2">
					<span className="text-md font-thin opacity-70 tabular-nums text-black k">
						期間
					</span>
					<div className="flex items-center gap-1">
						<input
							type="date"
							value={formData?.weekStart || ""}
							className="input input-md w-1/2 bg-gray01 text-black"
							min={today}
							onChange={(e) => selectWeekStart(e)}
						/>

						<span className="mx-1">~</span>
						<input
							type="date"
							value={formData?.weekEnd || ""}
							className="input input-md w-1/2 bg-gray01 text-black"
							min={today}
							onChange={(e) => selectWeekEnd(e)}
						/>
					</div>
				</div>
				<div className="flex  gap-1 flex-col px-2">
					<span className="text-md font-thin opacity-70 tabular-nums text-black ">
						提出期限
					</span>
					<input
						type="datetime-local"
						className="input w-full bg-gray01 text-black"
						value={formData?.deadline || ""}
						min={nowDateTime}
						max={maxDeadline}
						onChange={(e) => selectLimitData(e)}
					/>
				</div>
			</div>
		</div>
	);
};

export default PeriodForm;
