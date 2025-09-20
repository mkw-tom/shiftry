"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	AssignPositionBaseWithDateValidate,
	type AssignPositionWithDateInput,
} from "@shared/api/shift/assign/validations/put";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const useEditAssignPositionForm = ({
	initValue,
}: {
	initValue: AssignPositionWithDateInput;
}) => {
	const form = useForm<AssignPositionWithDateInput>({
		resolver: zodResolver(AssignPositionBaseWithDateValidate),
		mode: "onBlur",
		defaultValues: initValue,
	});

	const {
		register,
		formState: { errors },
		handleSubmit,
		watch,
		control,
		getValues,
		setValue,
	} = form;

	useEffect(() => {
		form.reset(initValue);
	}, [initValue, form]);

	const name = watch("name") ?? "";
	const jobRoles = watch("jobRoles") ?? [];
	const count = watch("count") ?? 1;
	const assignd = watch("assigned") ?? [];
	const watchs = { name, jobRoles, count, assignd };

	// バリデーションの有無をbooleanで
	const isDisabled =
		name.trim() === "" ||
		!!errors.name ||
		jobRoles.length === 0 ||
		!!errors.jobRoles ||
		count <= 0 ||
		!!errors.count;

	return {
		register,
		errors,
		isDisabled,
		watchs,
		handleSubmit,
		control,
		getValues,
		setValue,
		reset: form.reset, // 必要なら外へも返す
	};
};

export default useEditAssignPositionForm;
