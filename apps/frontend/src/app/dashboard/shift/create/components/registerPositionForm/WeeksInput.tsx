import type {
	UpsertShiftPositionBaseInput,
	WeekDayType,
} from "@shared/api/shiftPosition/validations/put-bulk";
import React from "react";
import { type Control, type FieldErrors, useController } from "react-hook-form";

const weeks: { label: string; value: WeekDayType }[] = [
	{ label: "月曜", value: "monday" },
	{ label: "火曜", value: "tuesday" },
	{ label: "水曜", value: "wednesday" },
	{ label: "木曜", value: "thursday" },
	{ label: "金曜", value: "friday" },
	{ label: "土曜", value: "saturday" },
	{ label: "日曜", value: "sunday" },
];

export default function WeeksInput({
	control,
	errors,
}: {
	control: Control<UpsertShiftPositionBaseInput>;
	errors: FieldErrors<UpsertShiftPositionBaseInput>;
}) {
	const { field } = useController({ name: "weeks", control });
	const selected: WeekDayType[] = field.value ?? [];

	const toggle = (val: WeekDayType) => {
		const next = selected.includes(val)
			? selected.filter((v) => v !== val)
			: [...selected, val];
		field.onChange(next);
	};

	return (
		<div className="mt-5 w-full h-auto">
			<h3 className="text-sm text-gray-600">固定曜日</h3>
			<ul className="flex flex-wrap items-center gap-2 m-1">
				{weeks.map((day) => (
					<li key={day.value} className="flex items-center">
						<input
							type="checkbox"
							checked={selected.includes(day.value)}
							onChange={() => toggle(day.value)}
							className="checkbox checkbox-sm checkbox-success border-gray01"
						/>
						<span className="ml-2 text-sm text-gray-600">{day.label}</span>
					</li>
				))}
			</ul>
			{errors.weeks && (
				<p className="text-xs text-red-500 mt-1">
					{String(errors.weeks.message)}
				</p>
			)}
		</div>
	);
}
