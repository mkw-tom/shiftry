import { useAgreeCheckbox } from "@/shared/hooks/useAgreeCheckBox";
import LineAuthButton from "../button/LineAuthButton";

const LineAuthForm = () => {
	const { register, isDisabled, errors } = useAgreeCheckbox();

	return (
		<>
			<fieldset className="fieldset w-11/12 mx-auto flex flex-col items-center">
				<label className="fieldset-label">
					<input
						{...register("agree")}
						type="checkbox"
						defaultChecked={false}
						className="checkbox checkbox-sm checkbox-success mb-3 sm:mb-1"
						disabled={false}
					/>
					<span className=" text-xs text-black">
						プロフィール情報の取得に同意します。
					</span>
				</label>
				{errors.agree && (
					<p className="fieldset-label text-error">{errors?.agree?.message}</p>
				)}
			</fieldset>
			<LineAuthButton isDisabled={isDisabled} />
		</>
	);
};

export default LineAuthForm;
