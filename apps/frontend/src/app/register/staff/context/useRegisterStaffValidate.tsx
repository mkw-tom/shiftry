import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	type RegisterStaffFormType,
	RegisterStaffFormValidate,
} from "../validation";

export const useRegisterStaffFormValidate = () => {
	const {
		register,
		formState: { errors },
		watch,
	} = useForm<RegisterStaffFormType>({
		resolver: zodResolver(RegisterStaffFormValidate),
		mode: "onChange",
	});

	const name = watch("name");
	const isDisabled = errors.name || name === "";

	return {
		register,
		errors,
		isDisabled,
		name,
	};
};
