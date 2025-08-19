import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type CheckBoxType, checkBoxValidate } from "../validation/agreeCheck";

export const useAgreeCheckbox = () => {
	const {
		register,
		formState: { errors },
		watch,
		handleSubmit,
	} = useForm<CheckBoxType>({
		resolver: zodResolver(checkBoxValidate),
		mode: "onChange",
	});

	const agree = watch("agree");
	const isDisabled = !agree;

	return {
		register,
		handleSubmit,
		errors,
		isDisabled,
		agree,
	};
};
