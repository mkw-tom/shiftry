// import { useSearchParams } from "next/navigation";
// import React from "react";
// import type { FieldError } from "react-hook-form";
// import { useStaffRegisterStep } from "../context/useStaffRegisterStep";

// const StaffRegistButton = ({
// 	name,
// 	isDisabled,
// }: {
// 	name: string;
// 	isDisabled: boolean | FieldError;
// }) => {
// 	const { stepLoading, changeStep } = useStaffRegisterStep();
// 	const searchParams = useSearchParams();
// 	const storeId = searchParams.get("storeId");
// 	const shiftRequestId = searchParams.get("shiftRequestId");

// 	const storeInput =
// 		storeId && shiftRequestId ? { storeId, shiftRequestId } : null;

// 	return (
// 		<button
// 			type="button"
// 			className="btn btn-sm sm:btn-md  bg-green02  rounded-full border-none w-2/3  mx-auto text-white"
// 			onClick={() => {
// 				if (!storeInput) {
// 					alert("店舗情報が不正です。LINE連携からやり直してください。");
// 					return;
// 				}
// 				changeStep(name, storeInput);
// 			}}
// 			disabled={!!isDisabled}
// 		>
// 			{!stepLoading ? (
// 				<div className="flex items-center gap-2">登録</div>
// 			) : (
// 				<span className="loading loading-dots" />
// 			)}
// 		</button>
// 	);
// };

// export default StaffRegistButton;
