import { zodResolver } from "@hookform/resolvers/zod";
import {
	type CreateEditStaffPreferenceExtendUserNameInput,
	createEditStaffPreferenceValidatonExtendUserName,
} from "@shared/api/staffPreference/validations/create";

import { useForm } from "react-hook-form";

const initialPreferenceForm = {
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
	init?: Partial<CreateEditStaffPreferenceExtendUserNameInput>,
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
	} = useForm<CreateEditStaffPreferenceExtendUserNameInput>({
		resolver: zodResolver(createEditStaffPreferenceValidatonExtendUserName),
		mode: "onChange",
		defaultValues: {
			userName: init?.userName ?? "",
			weekMin: init?.weekMin ?? 1,
			weekMax: init?.weekMax ?? 1,
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
