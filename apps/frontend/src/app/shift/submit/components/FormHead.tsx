"use client";
import PageBackButton from "@/app/dashboard/common/components/PageBackButton";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import React from "react";
import { useUpsertSubmitShift } from "../api/upsert-submitted-shfit/hook";
import { useSubmitShiftForm } from "../context/SubmitShiftFormContextProvider";

const FormHead = () => {
	const { formData } = useSubmitShiftForm();
	const { showToast } = useToast();
	const { handleUpsertSubmitShift } = useUpsertSubmitShift();

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
		<div className="flex items-center gap-3 py-3 px-3 border-b border-gray01">
			<PageBackButton saveDraftFunc={onSaveDraftSubmit} goHome={true} />
			<span className="text-green02 font-bold w-full text-center text-sm">
				シフト調整
			</span>
		</div>
	);
};

export default FormHead;
