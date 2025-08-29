import { YMDW } from "@shared/utils/formatDate";
import { ja } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { type DateRange, DayPicker } from "react-day-picker";
import { Controller } from "react-hook-form";
import { BiCalendar } from "react-icons/bi";
import { useCreateRequest } from "../context/CreateRequestFormProvider";
import useSelectDateForm from "../hook/form/useSelectDateForm";

const toYMD = (d: Date | null | undefined) =>
	d
		? new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
				.toISOString()
				.slice(0, 10)
		: "";
const fromYMD = (s?: string) => (s ? new Date(s) : undefined);

export function RangeCalendar() {
	const { setFormData, formData } = useCreateRequest();

	// RHF 初期値は context から取り込む
	const { control, errors, weekStart, weekEnd, setValue } = useSelectDateForm({
		weekStart: formData.weekStart || "",
		weekEnd: formData.weekEnd || "",
		deadline: formData.deadline || "",
	});

	// RHFの状態から DayPicker の選択状態を作る
	const selectedRange: DateRange | undefined =
		weekStart && weekEnd
			? {
					from: fromYMD(weekStart),
					to: fromYMD(weekEnd),
				}
			: undefined;

	const handleRangeSelect = (range: DateRange | undefined) => {
		const ws = toYMD(range?.from ?? null);
		const we = toYMD(range?.to ?? null);

		setValue("weekStart", ws, { shouldDirty: true, shouldValidate: true });
		setValue("weekEnd", we, { shouldDirty: true, shouldValidate: true });

		setFormData((prev) => ({
			...prev,
			weekStart: ws,
			weekEnd: we,
			deadline:
				prev.deadline && ws && new Date(prev.deadline) > new Date(ws)
					? ""
					: prev.deadline,
		}));
	};

	return (
		<div className="w-full flex flex-col gap-2 h-auto text-black">
			<div className="w-full flex flex-col gap-2 pb-2 pl-1">
				<p
					className={`mt-2 text-center flex items-center gap-2 border-l-6 p-2 pl-2 ${
						selectedRange?.from && selectedRange?.to
							? "border-green01"
							: "border-gray01"
					}`}
				>
					<BiCalendar className="text-xl" />

					{selectedRange?.from && selectedRange?.to ? (
						<span>
							{YMDW(selectedRange.from)}〜 {YMDW(selectedRange.to)}
						</span>
					) : (
						<span className="text-gray-500">選択されていません</span>
					)}
				</p>

				{/* 提出期限（RHF: Controller） */}
				<div
					className={`w-full flex items-center border-l-6 pl-2 ${
						!selectedRange?.from && !selectedRange?.to
							? "opacity-30 pointer-events-none"
							: ""
					} ${formData.deadline ? "border-green01 " : "border-gray01"}`}
				>
					<span>提出期限：</span>

					<Controller
						name="deadline"
						control={control}
						render={({ field: { value, onChange } }) => {
							const wkStartDate = fromYMD(weekStart);
							return (
								<DatePicker
									selected={value ? new Date(value) : null}
									onChange={(d: Date | null) => {
										const ymd = toYMD(d ?? null);
										onChange(ymd); // RHFへ
										setFormData((prev) => ({ ...prev, deadline: ymd })); // Contextへ
									}}
									locale={ja}
									dateFormat="yyyy/MM/dd (eee)"
									placeholderText="日付を選択"
									minDate={new Date()} // 今日以降
									maxDate={wkStartDate ?? undefined} // 週開始日まで
									className="input input-bordered w-full border bg-base text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-success"
								/>
							);
						}}
					/>
				</div>
				{/* エラーメッセージ（必要なら表示） */}

				{errors.weekEnd?.message && (
					<p className="text-error text-xs">{String(errors.weekEnd.message)}</p>
				)}
				{errors.deadline?.message && (
					<p className="text-error text-xs">
						{String(errors.deadline.message)}
					</p>
				)}
			</div>

			{/* 範囲カレンダー（選択→RHF+Context更新） */}
			<div className="px-4 mx-auto mt-1">
				<DayPicker
					mode="range"
					selected={selectedRange}
					onSelect={handleRangeSelect}
					numberOfMonths={1}
					defaultMonth={new Date()}
					required={false}
					locale={ja}
					modifiersClassNames={{
						selected: "bg-green03",
						range_start: "bg-green03 font-bold rounded-md",
						range_end: "bg-green03 font-bold rounded-md",
					}}
					className="w-full"
				/>
			</div>
		</div>
	);
}
