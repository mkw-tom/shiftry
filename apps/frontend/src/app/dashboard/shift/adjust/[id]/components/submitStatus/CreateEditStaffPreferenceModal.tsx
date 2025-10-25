import { useCreateStaffPreference } from "@/app/api/hook/staffPreference/useCreateStaffPreference";
import { addMember } from "@/redux/slices/members";
import type { StaffPreferenceDTO } from "@shared/api/staffPreference/dto";
import type { CreateEditStaffPreferenceExtendUserNameInput } from "@shared/api/staffPreference/validations/create.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAdjustShiftForm } from "../../context/AdjustShiftFormContextProvider.tsx";
import useCreatePreferenceForm from "../../hook/useCreateEditPreferenceForm";

export type StaffPreference = {
	onClose: (id: string) => void;
	preferenceInfo: Pick<
		StaffPreferenceDTO,
		"userId" | "weekMax" | "weekMin" | "weeklyAvailability"
	> & { userName: string };
};

// 仮の曜日リスト
const weekDays = [
	{ key: "mon", label: "月" },
	{ key: "tue", label: "火" },
	{ key: "wed", label: "水" },
	{ key: "thu", label: "木" },
	{ key: "fri", label: "金" },
	{ key: "sat", label: "土" },
	{ key: "sun", label: "日" },
];

const CreateEditStaffPreferenceModal = ({
	onClose,
	preferenceInfo,
}: StaffPreference) => {
	const {
		createStaffPreference,
		isLoading: isCreateLoading,
		error: createError,
	} = useCreateStaffPreference();
	const { setStaffPreferences, staffPreferences } = useAdjustShiftForm();
	const dispatch = useDispatch();
	const {
		register,
		errors,
		isDisabled,
		userName,
		weekMin,
		weekMax,
		weeklyAvailability,
		control,
		getValues,
		setValue,
		reset,
		weekMinMaxValid,
		handleSubmit,
	} = useCreatePreferenceForm({
		userName: preferenceInfo.userName,
		weekMin: preferenceInfo.weekMin,
		weekMax: preferenceInfo.weekMax,
		weeklyAvailability: preferenceInfo.weeklyAvailability,
	});

	useEffect(() => {
		if (preferenceInfo.userId === "") return;
		reset({
			userName: preferenceInfo.userName ?? "",
			weekMin: preferenceInfo.weekMin ?? 1,
			weekMax: preferenceInfo.weekMax ?? 1,
			weeklyAvailability: preferenceInfo.weeklyAvailability ?? {
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
	}, [preferenceInfo, reset]);

	const handleChange = (key: string, value: string) => {
		setValue(`weeklyAvailability.${key}`, value);
	};

	// 時間指定入力
	const handleTimeInput = (key: string, value: string) => {
		setValue(`weeklyAvailability.${key}`, value);
	};

	// 最小・最大出勤回数の選択肢（1〜7）
	const minOptions = Array.from({ length: 7 }, (_, i) => i + 1);
	const maxOptions = Array.from({ length: 7 }, (_, i) => i + 1);

	const testCreateLogic = (
		formData: CreateEditStaffPreferenceExtendUserNameInput,
	) => {
		dispatch(
			addMember({
				user: {
					id: `new-id-${staffPreferences.length + 1}`,
					name: formData.userName ?? "",
					pictureUrl: "",
					jobRoles: [],
				},
				role: "STAFF",
			}),
		);
		setStaffPreferences((prev) => [
			...prev,
			{
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: `new-id-${staffPreferences.length + 1}`,
				storeId: "",
				userName: formData.userName,
				weekMin: formData.weekMin,
				weekMax: formData.weekMax,
				weeklyAvailability: formData.weeklyAvailability,
				note: formData.note ?? null,
			},
		]);
	};
	const onSubmit = async (
		formData: CreateEditStaffPreferenceExtendUserNameInput,
	) => {
		if (preferenceInfo.userId === "") {
			if (process.env.NODE_ENV === "development") {
				testCreateLogic(formData);
				handleClose();
				return;
			}
			// 新規作成
			const res = await createStaffPreference({ formData });
			if (!res.ok) {
				alert(createError + res.message);
				handleClose();
				return;
			}
			if (res.user) {
				dispatch(addMember(res.user));
			}
			setStaffPreferences((prev) => [...prev, res.staffPreference]);
			handleClose();
		} else {
			setStaffPreferences((prev) =>
				prev.map((pref) => {
					if (pref.userId === preferenceInfo.userId) {
						return {
							...pref,
							userName: formData.userName,
							weekMin: formData.weekMin,
							weekMax: formData.weekMax,
							weeklyAvailability: formData.weeklyAvailability,
						};
					}
					return pref;
				}),
			);
			handleClose();
		}
	};

	const handleClose = () => {
		onClose(preferenceInfo.userId);
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
		<dialog
			id={`staff-preference-modal-${preferenceInfo?.userId}`}
			className="modal modal-middle"
		>
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
					{preferenceInfo.userId === "" ? (
						<input
							{...register("userName")}
							value={userName}
							className="input w-2/3 text-gray-700 font-bold bg-white border-none outeline-none focus:outline-none -ml-3"
							placeholder="ユーザー名を入力"
						/>
					) : (
						<span className="text-gray-700 font-bold">{userName}</span>
					)}
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
							className="select select-sm select-bordered bg-base text-gray-800"
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
							className="select select-sm select-bordered bg-base text-gray-800"
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
							<select
								className="select select-sm select-bordered bg-base text-gray-800"
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
							{weeklyAvailability[key] &&
								weeklyAvailability[key] !== "anytime" &&
								weeklyAvailability[key] !== "null" && (
									<input
										type="text"
										className="input input-sm input-bordered w-28 bg-base text-gray-800"
										value={
											weeklyAvailability[key] === "null" ||
											weeklyAvailability[key] === "anytime"
												? ""
												: weeklyAvailability[key]
										}
										placeholder="00:00-00:00"
										onChange={(e) => handleTimeInput(key, e.target.value)}
										disabled={
											weeklyAvailability[key] === "null" ||
											weeklyAvailability[key] === "anytime"
										}
									/>
								)}
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
						{preferenceInfo.userId === ""
							? isCreateLoading
								? "作成中..."
								: "作成"
							: "保存"}
					</button>
				</div>
			</form>
		</dialog>
	);
};

export default CreateEditStaffPreferenceModal;
