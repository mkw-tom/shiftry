import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import React from "react";
import { useUpsertSubmitShift } from "../api/upsert-submitted-shfit/hook";
import { useSubmitShiftForm } from "../context/SubmitShiftFormContextProvider";

const SubmitButton = () => {
	const { formData } = useSubmitShiftForm();
	const { handleUpsertSubmitShift } = useUpsertSubmitShift();
	const { showToast } = useToast();

	const onClickSubmit = async () => {
		const res = await handleUpsertSubmitShift({
			formData: { ...formData, status: "CONFIRMED" },
		});
		if (!res.ok) {
			alert("シフト提出に失敗しました。再度お試しください。");
			showToast("シフト提出に失敗しました。再度お試しください。", "error");
			return;
		}
		showToast("シフト提出が完了しました。", "success");
	};

	return (
		<div className="absolute bottom-5 left-0 right-0 w-full mx-auto flex justify-between gap-1 px-3 pb-5 pt-3">
			<button
				type="button"
				className="btn w-full bg-green01 text-white border-none shadow-md"
				onClick={onClickSubmit}
			>
				提出
			</button>
		</div>
	);
};

export default SubmitButton;
