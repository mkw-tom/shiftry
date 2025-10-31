import React, { useMemo } from "react";
import { useSubmitShiftForm } from "../context/SubmitShiftFormContextProvider";

const WeekMinMaxInput = () => {
	const { formData, setFormData } = useSubmitShiftForm();

	const minOptions = Array.from({ length: 7 }, (_, i) => i + 1);
	const maxOptions = Array.from({ length: 7 }, (_, i) => i + 1);
	const weekMinMaxValid = useMemo(() => {
		return formData.weekMin <= formData.weekMax;
	}, [formData.weekMin, formData.weekMax]);

	const setWeekMinMax = (mode: "min" | "max", value: string) => {
		const valueNum = Number(value);
		setFormData((prev) => ({
			...prev,
			weekMax: mode === "max" ? valueNum : prev.weekMax,
			weekMin: mode === "min" ? valueNum : prev.weekMin,
		}));
		console.log(formData);
	};

	return (
		<div className="mt-5 ml-2">
			<div className="mb-2 text-xs text-gray-700 font-bold">
				週の希望出勤回数
			</div>
			<div className="flex gap-2 mb-4">
				<label className="flex items-center gap-1">
					<span className="text-gray-500 text-sm w-16">最小</span>
					<select
						value={formData.weekMin}
						onChange={(e) => setWeekMinMax("min", e.target.value)}
						className="select select-sm select-bordered bg-base text-gray-800 focus:outline-none"
					>
						{minOptions.map((num) => (
							<option key={num} value={num}>
								{num}回
							</option>
						))}
					</select>
				</label>
				<label className="flex items-center gap-1">
					<span className="text-gray-500 text-sm w-16">最大</span>
					<select
						value={formData.weekMax}
						onChange={(e) => setWeekMinMax("max", e.target.value)}
						className="select select-sm select-bordered bg-base text-gray-800 focus:outline-none"
					>
						{maxOptions.map((num) => (
							<option key={num} value={num}>
								{num}回
							</option>
						))}
					</select>
				</label>
			</div>
			{!weekMinMaxValid && (
				<div className="text-xs text-red-500 mb-1">
					週の最小出勤回数は最大出勤回数以下である必要があります
				</div>
			)}
		</div>
	);
};

export default WeekMinMaxInput;
