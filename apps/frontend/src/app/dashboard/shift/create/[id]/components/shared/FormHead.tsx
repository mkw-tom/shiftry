"use client";
import PageBackButton from "@/app/dashboard/common/components/PageBackButton";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { useRouter } from "next/navigation";
import React from "react";
import { useUpsertShiftReqeust } from "../../api/upsert-shift-request/hook";
import { useCreateRequest } from "../../context/CreateRequestFormProvider";

const FormHead = () => {
	const { handleUpsertShiftRequest } = useUpsertShiftReqeust();
	const { formData } = useCreateRequest();
	const { showToast } = useToast();
	const router = useRouter();

	const saveDraftShiftRequest = async () => {
		const res = await handleUpsertShiftRequest({ ...formData, status: "HOLD" });
		if (!res.ok) {
			alert(res.message || "下書き保存に失敗しました");
			showToast("下書き保存に失敗しました", "error");
			return;
		}
		showToast("下書き保存しました", "success");
		alert("下書き保存しました");
		router.push("/dashboard/home");
	};

	const saveSkipBool =
		!formData.weekEnd || !formData.weekStart || !formData.deadline;

	return (
		<div className="flex items-center gap-3 py-3 px-3 border-b border-gray01">
			<PageBackButton
				saveDraftFunc={saveDraftShiftRequest}
				saveSkip={saveSkipBool}
			/>
			<span className="text-green02 font-bold w-full text-center text-sm">
				シフト作成
			</span>
		</div>
	);
};

export default FormHead;
