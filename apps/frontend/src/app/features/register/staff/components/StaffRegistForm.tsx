// import React from "react";
// import { useRegisterStaffFormValidate } from "../context/useRegisterStaffValidate";
// import { useStaffRegisterStep } from "../context/useStaffRegisterStep";
// import StaffRegistButton from "./StaffRegistButton";

// const StaffRegistForm = () => {
// 	const { register, errors, name, isDisabled } = useRegisterStaffFormValidate();
// 	const { stepLoading } = useStaffRegisterStep();
// 	return (
// 		<>
// 			<fieldset className="fieldset w-11/12 mx-auto flex flex-col items-center">
// 				<legend className="fieldset-legend text-black text-center">
// 					オーナー名
// 				</legend>
// 				<input
// 					{...register("name")}
// 					type="text"
// 					className="input input-xs sm:input-sm input-success bg-gray01 text-black"
// 					placeholder="例：タロウ"
// 					maxLength={20}
// 					disabled={stepLoading}
// 				/>
// 				<p className="fieldset-label text-error font-bold">
// 					※プライバシー保護のため、フルネームは避けてください。
// 				</p>
// 				{errors.name && (
// 					<p className="fieldset-label text-error">{errors.name.message}</p>
// 				)}
// 			</fieldset>
// 			<StaffRegistButton name={name} isDisabled={isDisabled} />
// 		</>
// 	);
// };

// export default StaffRegistForm;
