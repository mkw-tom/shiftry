import { MDW, YMDW } from "@shared/utils/formatDate";
import { ja } from "date-fns/locale";
import { use, useState } from "react";
import DatePicker from "react-datepicker";
import { type DateRange, DayPicker } from "react-day-picker";
import { BiCalendar } from "react-icons/bi";
import { useCreateRequest } from "../../../context/useCreateRequest";

export function RangeCalendar() {
	const { setFormData, formData } = useCreateRequest();

	const selectedRange: DateRange | undefined =
		formData.weekStart && formData.weekEnd
			? {
					from: new Date(formData.weekStart),
					to: new Date(formData.weekEnd),
				}
			: undefined;

	const handleRangeSelect = (selectedRange: DateRange | undefined) => {
		setFormData((prev) => ({
			...prev,
			weekStart: selectedRange?.from ? String(selectedRange.from) : "",
			weekEnd: selectedRange?.to ? String(selectedRange.to) : "",
		}));
	};

	return (
		<div className="w-full flex flex-col  gap-2 h-auto">
			<p
				className={`mt-2 text-center flex items-center gap-2 p-3  rounded-sm ${
					selectedRange?.from && selectedRange?.to ? "bg-green03" : "bg-base"
				}`}
			>
				<BiCalendar className="text-xl text-black" />

				{selectedRange?.from && selectedRange?.to ? (
					<span className="text-black">
						{YMDW(selectedRange.from)}〜 {YMDW(selectedRange.to)}
					</span>
				) : (
					<span className="text-gray-500">選択されていません</span>
				)}
			</p>
			<div
				className={`w-full flex items-center border-l-4 border-gray01 pl-2 ${
					!selectedRange?.from &&
					!selectedRange?.to &&
					"opacity-30 pointer-events-none"
				}`}
			>
				<span className="text-black">提出期限：</span>

				<DatePicker
					selected={formData.deadline ? new Date(formData.deadline) : null}
					onChange={(date) =>
						setFormData((prev) => ({
							...prev,
							deadline: date ? String(date) : "",
						}))
					}
					locale={ja}
					dateFormat="yyyy/MM/dd (eee)" // 「2025/08/01 (金)」形式
					placeholderText="日付を選択"
					minDate={new Date()} // 今日以降
					maxDate={
						selectedRange?.from ? new Date(selectedRange.from) : undefined
					}
					className="input input-bordered w-full border bg-base text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-success"
				/>
			</div>
			<div className="px-4 mx-auto mt-1">
				<DayPicker
					mode="range"
					selected={selectedRange}
					onSelect={handleRangeSelect}
					numberOfMonths={1} // ← 2ヶ月表示でリッチに
					defaultMonth={new Date()}
					required={false}
					locale={ja} // 日本語ロケールを設定
					modifiersClassNames={{
						selected: "bg-green03",
						range_start: "bg-green03 font-bold rounded-md",
						range_end: "bg-green03 font-bold rounded-md",
					}}
					className="text-black w-full"
				/>
			</div>
		</div>
	);
}
