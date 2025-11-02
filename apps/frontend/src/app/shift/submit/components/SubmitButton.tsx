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

	const onSaveDraftSubmit = async () => {
		const res = await handleUpsertSubmitShift({
			formData: { ...formData, status: "ADJUSTMENT" },
		});
		if (!res.ok && "message" in res) {
			alert(`シフト提出に失敗しました。再度お試しください。 ${res.message}`);
			showToast(
				"提出データの下書きに失敗しました。再度お試しください。",
				"error",
			);
			return;
		}
		showToast("提出データの下書きを保存しました。", "success");
	};

	return (
		<div className="fixed bottom-0 left-0 w-full flex items-center justify-around gap-2  px-3 pt-3 pb-6 bg-white border-t border-gray01 z-10">
			<button
				type="button"
				className="btn btn-sm bg-green03 text-green02 border-none flex-1"
				onClick={onClickSubmit}
			>
				一時保存
			</button>
			<button
				type="button"
				className="btn btn-sm bg-green02 text-white border-none flex-1"
				onClick={onSaveDraftSubmit}
			>
				提出
			</button>
		</div>
	);
};

export default SubmitButton;
