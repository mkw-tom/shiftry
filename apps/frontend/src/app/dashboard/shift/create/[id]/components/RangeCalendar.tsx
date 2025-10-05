import { isoUTCToLocalDate, toISODateUTC } from "@/app/utils/date";
import { YMDW } from "@shared/utils/formatDate";
import { ja } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { type DateRange, DayPicker } from "react-day-picker";
import { Controller } from "react-hook-form";
import { BiCalendar } from "react-icons/bi";
import { useCreateRequest } from "../context/CreateRequestFormProvider";
import useSelectDateForm from "../hook/useSelectDateForm";

export function RangeCalendar() {
	const { setFormData, formData } = useCreateRequest();

	// RHF 初期値は context から取り込む（ISOを入れる）
	const { control, errors, weekStart, weekEnd, setValue, deadline } =
		useSelectDateForm({
			weekStart: formData.weekStart || "",
			weekEnd: formData.weekEnd || "",
			deadline: formData.deadline || "",
		});

	// RHFの状態（ISO）から DayPicker の選択状態(Date)を作る
	const selectedRange: DateRange | undefined =
		(formData.weekStart && formData.weekEnd) || (weekEnd && weekStart)
			? {
					from: formData.weekStart
						? new Date(formData.weekStart)
						: isoUTCToLocalDate(weekStart || ""),
					to: formData.weekEnd
						? new Date(formData.weekEnd)
						: isoUTCToLocalDate(weekEnd || ""),
				}
			: undefined;

	const handleRangeSelect = (range: DateRange | undefined) => {
		const wsIso = toISODateUTC(range?.from ?? null);
		const weIso = toISODateUTC(range?.to ?? null);

		// RHFへ
		setValue("weekStart", wsIso, { shouldDirty: true, shouldValidate: true });
		setValue("weekEnd", weIso, { shouldDirty: true, shouldValidate: true });

		// Contextへ
		setFormData((prev) => {
			// 期限が週開始を超えてたらクリア
			const wkStartLocal = isoUTCToLocalDate(wsIso);
			const deadlineLocal = isoUTCToLocalDate(prev.deadline);
			const shouldClearDeadline =
				!!deadlineLocal && !!wkStartLocal && deadlineLocal > wkStartLocal;

			return {
				...prev,
				weekStart: wsIso,
				weekEnd: weIso,
				deadline: shouldClearDeadline ? "" : prev.deadline,
			};
		});
	};

	return (
		<div className="w-full flex flex-col gap-2 h-auto text-black">
			<div className="w-full flex flex-col gap-2 pl-2">
				<h2 className="text-start text-sm font-bold border-green02 text-green02 flex items-center gap-2 mt-2 ">
					<BiCalendar
						className={`text-lg ${
							selectedRange?.from && selectedRange?.to ? "text-green02" : ""
						}`}
					/>
					{selectedRange?.from && selectedRange?.to ? (
						<span className="text-green02 font-bold text-sm">
							{YMDW(selectedRange.from)}~ {YMDW(selectedRange.to)}
						</span>
					) : (
						<span className="text-gray-500">選択されていません</span>
					)}
				</h2>

				{/* 提出期限（RHF: Controller） */}
				<div
					className={`w-full flex items-center pl-1 gap-2 ${
						!selectedRange?.from && !selectedRange?.to
							? "opacity-30 pointer-events-none"
							: ""
					} ${formData.deadline ? "border-green01 " : "border-gray01"}`}
				>
					<span className="text-sm text-700">提出期限</span>

					<Controller
						name="deadline"
						control={control}
						render={({ field: { value, onChange } }) => {
							const wkStartDate = isoUTCToLocalDate(weekStart);
							const selectedDeadline = formData.deadline
								? new Date(formData.deadline)
								: isoUTCToLocalDate(value);
							return (
								<DatePicker
									selected={selectedDeadline}
									onChange={(d: Date | null) => {
										const iso = toISODateUTC(d);
										onChange(iso); // RHFへ ISO
										setFormData((prev) => ({ ...prev, deadline: iso })); // Contextへ ISO
									}}
									locale={ja}
									dateFormat="yyyy/MM/dd (eee)"
									placeholderText="日付を選択"
									minDate={new Date()} // 今日以降（ローカル）
									maxDate={wkStartDate ?? undefined} // 週開始まで（ローカルDate）
									className="input input-bordered text-[16px] scale-[0.8] w-full border bg-base text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-success z-50 -ml-3"
								/>
							);
						}}
					/>
				</div>

				{/* エラー表示（必要なら） */}
				{errors.weekEnd?.message && (
					<p className="text-error text-xs">{String(errors.weekEnd.message)}</p>
				)}
				{errors.deadline?.message && (
					<p className="text-error text-xs">
						{String(errors.deadline.message)}
					</p>
				)}
			</div>

			{/* 範囲カレンダー */}
			<div className="px-4 mx-auto">
				<DayPicker
					mode="range"
					selected={selectedRange}
					onSelect={handleRangeSelect}
					numberOfMonths={1}
					defaultMonth={selectedRange?.from}
					required={false}
					locale={ja}
					modifiersClassNames={{
						selected: "bg-green03",
						range_start: "bg-green03 font-bold rounded-md",
						range_end: "bg-green03 font-bold rounded-md",
					}}
					className="w-full z-0"
				/>
			</div>
		</div>
	);
}
