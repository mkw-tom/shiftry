import liff from "@line/liff";
import { use } from "react";
import type { FieldError } from "react-hook-form";
import useRegisterOwner from "../../hooks/useRegisterOwner";

const RegisterButton = ({
	isDisabled,
	loading,
}: {
	isDisabled: true | FieldError | undefined;
	loading: boolean;
}) => {
	return (
		<button
			type="submit"
			className={`btn sm:btn-md ${
				isDisabled || loading
					? "bg-gray01 opacity-80 pointer-events-none"
					: " bg-green02"
			} rounded-md border-none w-11/12 mx-auto text-white mt-5 `}
			// onClick={handleRegisterOwner}
			disabled={loading}
		>
			{loading ? <span className="loading loading-dots loading-sm" /> : "登録"}
		</button>
	);
};

export default RegisterButton;
