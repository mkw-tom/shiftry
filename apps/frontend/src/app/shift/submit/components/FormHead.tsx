"use client";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import React from "react";
import { useUpsertSubmitShift } from "../api/upsert-submitted-shfit/hook";
import { useSubmitShiftForm } from "../context/SubmitShiftFormContextProvider";

const FormHead = () => {
	const { formData } = useSubmitShiftForm();
	const { showToast } = useToast();
	const { handleUpsertSubmitShift } = useUpsertSubmitShift();

	const onClickSubmitDraft = async () => {
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
		<div className="w-full mx-auto pt-5 border-b border-gray01 pb-1 flex items-center px-3">
			<h2 className="text-green02 font-bold text-sm">シフト希望提出</h2>
			<button
				type="button"
				className="btn btn-sm btn-link text-gray-500 ml-auto"
				onClick={onClickSubmitDraft}
			>
				下書き保存
			</button>
		</div>
	);
};

export default FormHead;
