import type { FieldError } from "react-hook-form";

const RegisterButton = ({
	name,
	storeName,
	isDisabled,
}: {
	name: string;
	storeName: string;
	isDisabled: true | FieldError | undefined;
}) => {
	return (
		<button
			type="button"
			className="btn btn-sm sm:btn-md  bg-green02  rounded-md border-none w-11/12 mx-auto text-white mt-5"
			// onClick={handleRegister}
			disabled={!!isDisabled}
		>
			登録
		</button>
	);
};

export default RegisterButton;
