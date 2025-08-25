import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isValid } from "zod";
import { type emailType, emailValidate } from "../form";

const useEmailValidate = () => {
	const {
		register,
		formState: { errors },
		watch,
	} = useForm<emailType>({
		resolver: zodResolver(emailValidate),
		mode: "onBlur",
	});
	const email = watch("email") ?? "";
	const isDisabled = !isValid || email === "" || errors.email;

	return { register, errors, isDisabled, email };
};

export default useEmailValidate;
