import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isValid } from "zod";
import {
	type regiserOwnerAndStoreType,
	regiserOwnerAndStoreValidate,
} from "../validation/form";

const useRegiserOwnerAndStore = () => {
	const {
		register,
		formState: { errors },
		watch,
		handleSubmit,
	} = useForm<regiserOwnerAndStoreType>({
		resolver: zodResolver(regiserOwnerAndStoreValidate),
		mode: "onChange",
	});
	const name = watch("name") ?? "";
	const storeName = watch("storeName") ?? "";
	const checkboxAgree = watch("agree") ?? false;
	const isDisabled =
		!isValid ||
		storeName === "" ||
		name === "" ||
		!checkboxAgree ||
		errors.name ||
		errors.storeName;

	return {
		register,
		errors,
		isDisabled,
		name,
		storeName,
		checkboxAgree,
		handleSubmit,
	};
};

export default useRegiserOwnerAndStore;
