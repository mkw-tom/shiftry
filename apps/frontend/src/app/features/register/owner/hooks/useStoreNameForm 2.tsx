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
	} = useForm<regiserOwnerAndStoreType>({
		resolver: zodResolver(regiserOwnerAndStoreValidate),
		mode: "onChange",
	});
	const name = watch("name") ?? "";
	const storeName = watch("storeName") ?? "";
	const isDisabled =
		!isValid ||
		storeName === "" ||
		name === "" ||
		errors.name ||
		errors.storeName;

	return { register, errors, isDisabled, name, storeName };
};

export default useRegiserOwnerAndStore;
