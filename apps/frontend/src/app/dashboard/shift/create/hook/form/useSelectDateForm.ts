"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type SelectDateOfRequestPositionInput,
	SelectDateOfRequestPositionValidate,
} from "@shared/api/shift/request/validations/put";
import { useForm } from "react-hook-form";

const useSelectDateForm = (
	init?: Partial<SelectDateOfRequestPositionInput>,
) => {
	const {
		register,
		formState: { errors, isValid },
		watch,
		control,
		getValues,
		setValue,
		reset,
	} = useForm<SelectDateOfRequestPositionInput>({
		resolver: zodResolver(SelectDateOfRequestPositionValidate),
		mode: "onChange",
		defaultValues: {
			weekStart: init?.weekStart ?? "",
			weekEnd: init?.weekEnd ?? "",
			deadline: init?.deadline ?? "",
		},
	});

	const weekStart = watch("weekStart") ?? "";
	const weekEnd = watch("weekEnd") ?? "";
	const deadline = watch("deadline") ?? "";

	const isDisabled =
		!isValid ||
		weekStart === "" ||
		weekEnd === "" ||
		deadline === "" ||
		!!errors.weekStart ||
		!!errors.weekEnd ||
		!!errors.deadline;

	return {
		register,
		errors,
		isDisabled,
		weekStart,
		weekEnd,
		deadline,
		control,
		getValues,
		setValue,
		reset,
	};
};

export default useSelectDateForm;
