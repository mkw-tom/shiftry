import { useRegisterLoadingUI } from "../../../common/context/useRegisterLoadingUI";
import useRegiserOwnerAndStore from "../../hooks/useStoreNameForm";
import RegisterButton from "../button/RegisterButton";

const RegisterForm = () => {
	const { register, errors, isDisabled, name, storeName } =
		useRegiserOwnerAndStore();
	const { apiLoading } = useRegisterLoadingUI();

	return (
		<>
			<fieldset className="fieldset w-11/12 mx-auto flex flex-col items-center">
				<legend className="fieldset-legend text-black text-center">
					オーナー名
				</legend>
				<input
					{...register("name")}
					type="text"
					className="input input-xs sm:input-sm input-success bg-gray01 text-black"
					placeholder="例：タロウ"
					maxLength={20}
					disabled={apiLoading}
				/>
				<p className="fieldset-label text-error font-bold">
					※プライバシー保護のため、フルネームは避けてください。
				</p>
				{errors.name && (
					<p className="fieldset-label text-error">{errors.name.message}</p>
				)}
			</fieldset>
			<fieldset className="fieldset w-11/12 mx-auto flex flex-col items-center">
				<legend className="fieldset-legend text-black text-center">
					店舗名
				</legend>
				<input
					{...register("storeName")}
					type="text"
					className="input input-xs sm:input-sm input-success bg-gray01 text-black"
					placeholder="例：株式会社〇〇"
					maxLength={20}
					disabled={apiLoading}
				/>
				{errors.storeName && (
					<p className="fieldset-label text-error">
						{errors.storeName.message}
					</p>
				)}
			</fieldset>

			<RegisterButton
				name={name}
				storeName={storeName}
				isDisabled={isDisabled}
			/>
		</>
	);
};

export default RegisterForm;
