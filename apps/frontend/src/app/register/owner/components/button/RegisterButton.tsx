import liff from "@line/liff";
import { use } from "react";
import type { FieldError } from "react-hook-form";
import useRegisterOwner from "../../hooks/useRegisterOwner";

const RegisterButton = ({
	ownerName,
	storeName,
	isDisabled,
}: {
	ownerName: string;
	storeName: string;
	isDisabled: true | FieldError | undefined;
}) => {
	const { loading, error, registerOwner } = useRegisterOwner();

	const handleRegisterOwner = async () => {
		const result = await registerOwner(ownerName, storeName);
		if (result.ok) {
			const confirmed = window.confirm(
				"登録が完了しました！\n\nShiftryをLINEグループに招待しましょう！",
			);
			if (confirmed) {
				liff.closeWindow();
			}
		}
	};

	if (error) {
		const errorConfirmed = window.confirm(
			"登録に失敗しました！\n\nページを開き直してください。",
		);
		if (errorConfirmed) {
			liff.closeWindow();
		}
	}

	return (
		<button
			type="submit"
			className={`btn sm:btn-md ${
				isDisabled || loading
					? "bg-gray01 opacity-80 pointer-events-none"
					: " bg-green02"
			} rounded-md border-none w-11/12 mx-auto text-white mt-5 `}
			onClick={handleRegisterOwner}
			disabled={loading}
		>
			{loading ? <span className="loading loading-dots loading-sm" /> : "登録"}
		</button>
	);
};

export default RegisterButton;
