import liff from "@line/liff";
import { BiHome } from "react-icons/bi";
import { LuUser } from "react-icons/lu";
import { useRegisterLoadingUI } from "../../../../features/register/common/context/useRegisterLoadingUI";
import useRegisterOwner from "../../hooks/useRegisterOwner";
import useRegiserOwnerAndStore from "../../hooks/useStoreNameForm";
import RegisterButton from "../button/RegisterButton";

const RegisterForm = () => {
	const { register, errors, isDisabled, name, storeName, handleSubmit } =
		useRegiserOwnerAndStore();
	const { loading, error, registerOwner } = useRegisterOwner();

	const onSubmit = async () => {
		// ここで API 呼び出し
		await registerOwner(name, storeName);
		if (error) {
			if (!window.confirm(`登録に失敗しました: ${error}`)) {
				liff.closeWindow();
			}
			console.error("Registration failed:", error);
		} else {
			// 成功時の処理
			if (!window.confirm("登録が成功しました")) {
				liff.closeWindow();
			}
			console.log("Registration successful");
		}
	};

	return (
		<div className="flex justify-center mt-5 w-full">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-5 w-full"
			>
				<fieldset className="fieldset w-full mx-auto flex flex-col items-center">
					<legend className="fieldset-legend text-gray02 text-center">
						<LuUser />
						オーナー名
					</legend>
					<input
						{...register("name")}
						type="text"
						className="input input-bordered w-4/5 text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-success"
						placeholder="例：タロウ"
						maxLength={20}
						// disabled={apiLoading}
					/>
					{errors.name && (
						<p className="fieldset-label text-error">{errors.name.message}</p>
					)}
					<p className="fieldset-label text-error font-bold">
						※プライバシー保護のため、フルネームは避けてください。
					</p>
				</fieldset>
				<fieldset className="fieldset w-full mx-auto flex flex-col items-center">
					<legend className="fieldset-legend text-gray02 text-center">
						<BiHome />
						店舗名
					</legend>
					<input
						{...register("storeName")}
						type="text"
						className="input input-bordered w-4/5 text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-success"
						placeholder="例：株式会社〇〇"
						maxLength={20}
						// disabled={apiLoading}
					/>
					{errors.storeName && (
						<p className="fieldset-label text-error">
							{errors.storeName.message}
						</p>
					)}
				</fieldset>

				<fieldset className="fieldset w-full mx-auto flex flex-col items-center">
					<label className="fieldset-label flex items-center">
						<input
							{...register("agree")}
							type="checkbox"
							defaultChecked={false}
							className="checkbox checkbox-sm checkbox-success mb-0.5 "
							disabled={false}
						/>
						<span className=" text-xs text-black">
							プロフィール情報の取得に同意します。
						</span>
					</label>
					{errors.agree && (
						<p className="fieldset-label text-error">
							{errors?.agree?.message}
						</p>
					)}
				</fieldset>

				<RegisterButton isDisabled={isDisabled} loading={loading} />
			</form>
		</div>
	);
};

export default RegisterForm;
