import { useCreateStaffPreference } from "@/app/api/hook/staffPreference/useCreateStaffPreference";
import { useUpdateStaffPreference } from "@/app/api/hook/staffPreference/useUpdateStaffPreference";
import TimeSelecter from "@/app/dashboard/common/components/TimeSelecter";
import { addMember } from "@/redux/slices/members";
import type { CreateEditStaffPreferenceFormInput } from "@shared/api/staffPreference/validations/create.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useCreatePreferenceForm from "../../shift/adjust/[id]/hook/useCreateEditPreferenceForm";

export type StaffPreference = {
	onClose: () => void;
};

const weekDays = [
	{ key: "mon", label: "月" },
	{ key: "tue", label: "火" },
	{ key: "wed", label: "水" },
	{ key: "thu", label: "木" },
	{ key: "fri", label: "金" },
	{ key: "sat", label: "土" },
	{ key: "sun", label: "日" },
];

const CreateStaffPreferenceModal = ({ onClose }: StaffPreference) => {
	const {
		createStaffPreference,
		isLoading: isCreateLoading,
		error: createError,
	} = useCreateStaffPreference();
	const {
		updateStaffPreference,
		isLoading: isUpdateLoading,
		error: updateError,
	} = useUpdateStaffPreference();

	const dispatch = useDispatch();
	const {
		register,
		errors,
		isDisabled,
		userName,
		weeklyAvailability,
		setValue,
		reset,
		weekMinMaxValid,
		handleSubmit,
	} = useCreatePreferenceForm();

	useEffect(() => {
		reset({
			userId: "",
			userName: "",
			weekMin: 1,
			weekMax: 1,
			weeklyAvailability: {
				mon: "anytime",
				tue: "anytime",
				wed: "anytime",
				thu: "anytime",
				fri: "anytime",
				sat: "anytime",
				sun: "anytime",
			},
			note: "",
		});
	}, [reset]);

	const handleChange = (key: string, value: string) => {
		setValue(`weeklyAvailability.${key}`, value);
	};

	const handleTimeInput = (key: string, value: string) => {
		setValue(`weeklyAvailability.${key}`, value);
	};

	const minOptions = Array.from({ length: 7 }, (_, i) => i + 1);
	const maxOptions = Array.from({ length: 7 }, (_, i) => i + 1);

	const onSubmit = async (formData: CreateEditStaffPreferenceFormInput) => {
		const res = await createStaffPreference({ formData });
		if (!res.ok) {
			alert(createError + res.message);
			handleClose();
			return;
		}
		if (res.user) {
			dispatch(addMember(res.user));
		}
		handleClose();
	};

	const handleClose = () => {
		onClose();
		reset({
			userId: "",
			userName: "",
			weekMin: 1,
			weekMax: 1,
			weeklyAvailability: {
				mon: "anytime",
				tue: "anytime",
				wed: "anytime",
				thu: "anytime",
				fri: "anytime",
				sat: "anytime",
				sun: "anytime",
			},
		});
	};

	return (
		<dialog id={"staff-preference-modal-create"} className="modal modal-middle">
			<form
				className="modal-box max-w-xs bg-white"
				onSubmit={handleSubmit(onSubmit)}
			>
				<button
					type="button"
					className="btn btn-sm btn-circle absolute right-2 top-2 bg-white text-gray02 border border-gray02 shadow-none"
					onClick={handleClose}
				>
					✕
				</button>
				<div className="flex items-center gap-3 mb-2">
					<input
						{...register("userName")}
						value={userName}
						className="w-full outline-none text-gray-600 font-bold"
						placeholder="ユーザー名を入力"
					/>
				</div>
				{errors.userName && (
					<div className="text-xs text-red-500 mb-1">
						{errors.userName.message}
					</div>
				)}
				<div className="mb-2 text-xs text-gray-700 font-bold">
					週の希望出勤回数
				</div>
				<div className="flex gap-2 mb-4">
					<label className="flex items-center gap-1">
						<span className="text-gray-500 text-sm w-16">最小</span>
						<select
							{...register("weekMin", { valueAsNumber: true })}
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
							{...register("weekMax", { valueAsNumber: true })}
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
				<div className="mb-2 text-xs text-gray-700 font-bold">
					曜日ごとの出勤可能時間
				</div>
				<div className="max-h-72 overflow-y-auto">
					{weekDays.map(({ key, label }) => (
						<div
							key={key}
							className="flex gap-2 items-center mb-2 px-1 py-1 border-b border-gray-200 bg-transparent"
						>
							<span className="text-gray-500 min-w-[40px] text-sm">
								{label}
							</span>
							<div className="flex flex-col gap-1 w-full">
								<select
									className="select select-sm select-bordered bg-base text-gray-800 focus:outline-none"
									value={
										weeklyAvailability[key] === "null"
											? "none"
											: weeklyAvailability[key] === "anytime"
												? "anytime"
												: "time"
									}
									onChange={(e) => {
										const v = e.target.value;
										if (v === "none") handleChange(key, "null");
										else if (v === "anytime") handleChange(key, "anytime");
										else if (v === "time") handleChange(key, "09:00-13:00"); // デフォルト値
									}}
								>
									<option value="none">休み</option>
									<option value="anytime">終日</option>
									<option value="time">時間指定</option>
								</select>
								{(() => {
									const timeValue =
										weeklyAvailability[key] &&
										typeof weeklyAvailability[key] === "string"
											? weeklyAvailability[key]
											: "09:00-13:00";
									const [start, end] = timeValue.split("-");
									const isTime =
										weeklyAvailability[key] !== "null" &&
										weeklyAvailability[key] !== "anytime";
									return (
										<div
											className={`${
												isTime ? "flex" : "hidden"
											} gap-1 items-center mt-1`}
										>
											<TimeSelecter
												value={start}
												onChange={(newStart) =>
													handleTimeInput(key, `${newStart}-${end}`)
												}
												step={30}
												start="00:00"
												end="23:30"
												btnStyle="w-24 btn-sm bg-base"
												color="success"
											/>
											<span className="mx-1">~</span>
											<TimeSelecter
												value={end}
												onChange={(newEnd) =>
													handleTimeInput(key, `${start}-${newEnd}`)
												}
												step={30}
												start="00:00"
												end="23:30"
												btnStyle="w-24 btn-sm bg-base"
												color="success"
											/>
										</div>
									);
								})()}
							</div>
						</div>
					))}
				</div>
				{errors.weeklyAvailability &&
					typeof errors.weeklyAvailability.message === "string" && (
						<div className="text-xs text-red-500 mb-1">
							{errors.weeklyAvailability.message}
						</div>
					)}
				<div>
					<button
						type="submit"
						className="btn btn-sm btn-success mt-4 w-full"
						disabled={isCreateLoading || isDisabled}
					>
						{isCreateLoading ? "作成中..." : "作成"}
					</button>
				</div>
			</form>
		</dialog>
	);
};

export default CreateStaffPreferenceModal;
