"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type RequestPositionWithDateInput,
	RequestPositionWithDateValidate,
} from "@shared/api/shift/request/validations/put";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const useAdjustPositionForm = ({
	initValue,
}: {
	initValue: RequestPositionWithDateInput;
}) => {
	const form = useForm<RequestPositionWithDateInput>({
		resolver: zodResolver(RequestPositionWithDateValidate),
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
	const absolute = watch("absolute") ?? [];
	const priority = watch("priority") ?? [];
	const watchs = { name, jobRoles, count, absolute, priority };

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

export default useAdjustPositionForm;
