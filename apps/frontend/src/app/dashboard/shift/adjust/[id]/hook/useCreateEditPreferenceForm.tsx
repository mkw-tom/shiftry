import { zodResolver } from "@hookform/resolvers/zod";
import {
	type CreateEditStaffPreferenceFormInput,
	createEditStaffPreferenceFormValidaton,
} from "@shared/api/staffPreference/validations/create";

import { useForm } from "react-hook-form";

export const initialPreferenceForm = {
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
};

const useCreatePreferenceForm = (
	init?: Partial<CreateEditStaffPreferenceFormInput>,
) => {
	const {
		register,
		formState: { errors, isValid },
		watch,
		control,
		getValues,
		setValue,
		handleSubmit,
		reset,
	} = useForm<CreateEditStaffPreferenceFormInput>({
		resolver: zodResolver(createEditStaffPreferenceFormValidaton),
		mode: "onChange",
		defaultValues: {
			userId: init?.userId,
			userName: init?.userName,
			weekMin: init?.weekMin,
			weekMax: init?.weekMax,
			weeklyAvailability: init?.weeklyAvailability ?? {
				mon: "anytime",
				tue: "anytime",
				wed: "anytime",
				thu: "anytime",
				fri: "anytime",
				sat: "anytime",
				sun: "anytime",
			},
			note: init?.note ?? "",
		},
	});

	const userName = watch("userName") ?? "";
	const weekMin = watch("weekMin") ?? 1;
	const weekMax = watch("weekMax") ?? 1;
	const weeklyAvailability = watch("weeklyAvailability") ?? {
		mon: "anytime",
		tue: "anytime",
		wed: "anytime",
		thu: "anytime",
		fri: "anytime",
		sat: "anytime",
		sun: "anytime",
	};
	const note = watch("note") ?? "";

	const weekMinMaxValid = weekMin <= weekMax;

	const isDisabled =
		!isValid ||
		userName === "" ||
		weekMin === undefined ||
		weekMax === undefined ||
		!!errors.userName ||
		!!errors.weekMin ||
		!!errors.weekMax ||
		!!errors.weeklyAvailability;

	return {
		register,
		errors,
		isDisabled,
		userName,
		weekMin,
		weekMax,
		weeklyAvailability,
		note,
		control,
		getValues,
		setValue,
		handleSubmit,
		reset,
		weekMinMaxValid,
	};
};

export default useCreatePreferenceForm;
