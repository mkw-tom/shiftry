import React from "react";
import { useAgreeCheckbox } from "../../../common/hooks/useAgreeCheckBox";
import { useRegisterLoadingUI } from "../../common/context/useRegisterLoadingUI";
import ConnectButton from "./ConnectButton";

const ConnectModal = () => {
	const { register, isDisabled, errors } = useAgreeCheckbox();
	const { apiLoading } = useRegisterLoadingUI();

	return (
		<>
			<fieldset className="fieldset w-11/12 mx-auto flex flex-col items-center">
				<label className="fieldset-label">
					<input
						{...register("agree")}
						type="checkbox"
						defaultChecked={false}
						className="checkbox checkbox-sm checkbox-success mb-3 sm:mb-1"
						disabled={apiLoading}
					/>
					<span className=" text-xs text-black">
						サービス利用のため、LINEグループの情報取得に同意します。
					</span>
				</label>
				{errors.agree && (
					<p className="fieldset-label text-error">{errors?.agree?.message}</p>
				)}
			</fieldset>
			<ConnectButton isDisabled={isDisabled} />
		</>
	);
};

export default ConnectModal;
