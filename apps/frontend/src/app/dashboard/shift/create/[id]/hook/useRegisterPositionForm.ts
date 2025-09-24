import { zodResolver } from "@hookform/resolvers/zod";
import {
	UpsertShiftPositionBase,
	type UpsertShiftPositionBaseInput,
} from "@shared/api/shiftPosition/validations/put-bulk";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { isValid } from "zod";

const useRegisterPositionForm = ({
	initValue,
}: {
	initValue: UpsertShiftPositionBaseInput;
}) => {
	const form = useForm<UpsertShiftPositionBaseInput>({
		resolver: zodResolver(UpsertShiftPositionBase),
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
	const start = watch("startTime") ?? "";
	const end = watch("endTime") ?? "";
	const weeks = watch("weeks") ?? [];
	const jobRoles = watch("jobRoles") ?? [];
	const count = watch("count") ?? 1;
	const priority = watch("priority") ?? [];
	const absolute = watch("absolute") ?? [];

	const watchs = {
		name,
		start,
		end,
		weeks,
		jobRoles,
		count,
		priority,
		absolute,
	};

	const isDisabled =
		!isValid ||
		name === "" ||
		errors.name ||
		start === "" ||
		errors.startTime ||
		end === "" ||
		errors.endTime ||
		weeks.length === 0 ||
		errors.weeks ||
		jobRoles.length === 0 ||
		errors.jobRoles ||
		count <= 0 ||
		errors.count;

	return {
		register,
		errors,
		isDisabled,
		watchs,
		handleSubmit,
		control,
		getValues,
		setValue,
		reset: form.reset, // 必要なら外へも返す };
	};
};

export default useRegisterPositionForm;
