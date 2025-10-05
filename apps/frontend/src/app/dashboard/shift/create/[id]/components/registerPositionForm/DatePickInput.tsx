import type { UpsertShiftPositionBaseInput } from "@shared/api/shiftPosition/validations/put-bulk";
import { ja } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { type Control, Controller } from "react-hook-form";

// ISO <-> Date 変換ヘルパ
const fromISO = (iso?: string | null) => (iso ? new Date(iso) : null);
const toISO = (d: Date | null) => (d ? d.toISOString() : "");

export default function DatePickInput({
	control,
}: {
	control: Control<UpsertShiftPositionBaseInput>;
}) {
	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-sm text-gray-600">勤務時間（開始〜終了）</h3>

			<div className="flex items-center gap-3 h-9">
				{/* startTime（ISOで保持） */}
				<div className="flex flex-col">
					<Controller
						name="startTime"
						control={control}
						rules={{ required: "出勤時刻は必須です" }}
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<>
								<DatePicker
									selected={fromISO(value)} // ISO -> Date
									onChange={(d) => onChange(toISO(d))} // Date -> ISO
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={30}
									timeCaption="出勤"
									dateFormat="HH:mm" // 表示はHH:mm
									locale={ja}
									placeholderText="出勤"
									className={`input input-bordered text-[16px] w-18 bg-base text-black border-gray-300 focus:outline-none focus:ring-2 ${
										error
											? "border-red-500 focus:ring-red-400"
											: "focus:ring-success"
									}`}
									aria-invalid={!!error}
								/>
								{error && (
									<span className="mt-1 text-xs text-red-500">
										{error.message}
									</span>
								)}
							</>
						)}
					/>
				</div>

				<span className="text-gray-600">〜</span>

				{/* endTime（ISOで保持） */}
				<div className="flex flex-col">
					<Controller
						name="endTime"
						control={control}
						rules={{ required: "退勤時刻は必須です" }}
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<>
								<DatePicker
									selected={fromISO(value)}
									onChange={(d) => onChange(toISO(d))}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={30}
									timeCaption="退勤"
									dateFormat="HH:mm"
									locale={ja}
									placeholderText="退勤"
									className={`input input-bordered text-[16px] w-18 bg-base text-black border-gray-300 focus:outline-none focus:ring-2 ${
										error
											? "border-red-500 focus:ring-red-400"
											: "focus:ring-success"
									}`}
									aria-invalid={!!error}
								/>
								{error && (
									<span className="mt-1 text-xs text-red-500">
										{error.message}
									</span>
								)}
							</>
						)}
					/>
				</div>
			</div>
		</div>
	);
}
