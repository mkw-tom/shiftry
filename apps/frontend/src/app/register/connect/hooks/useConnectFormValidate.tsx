"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	type connectFormType,
	connectFormValidate,
} from "../validation/connectForm";

export const useConnectFormValidate = () => {
	const {
		register,
		formState: { errors },
		watch,
		handleSubmit,
	} = useForm<connectFormType>({
		resolver: zodResolver(connectFormValidate),
		mode: "onChange",
	});

	const storeCode = watch("storeCode") ?? "";
	const agree = watch("agree");
	const isDisabled =
		!agree || storeCode === "" || errors.agree || errors.storeCode;

	return {
		register,
		handleSubmit,
		errors,
		isDisabled,
		storeCode,
		agree,
	};
};
