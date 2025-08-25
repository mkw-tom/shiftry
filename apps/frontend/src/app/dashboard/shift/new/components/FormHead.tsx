"use client";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { useRouter } from "next/navigation";
import React from "react";
import { useUpsertShiftReqeust } from "../api/upsert-shift-request/hook";
import { useCreateRequest } from "../context/useCreateRequest";

const FormHead = () => {
	const { handleUpsertShiftRequest } = useUpsertShiftReqeust();
	const { formData, setFormData } = useCreateRequest();
	const { showToast } = useToast();
	const router = useRouter();

	const saveDraftShiftRequest = async () => {
		setFormData({ ...formData, status: "HOLD" });
		const res = await handleUpsertShiftRequest(formData);
		if (!res.ok) {
			alert(res.message || "下書き保存に失敗しました");
			showToast("下書き保存に失敗しました", "error");
			return;
		}
		showToast("下書き保存しました", "success");
		alert("下書き保存しました");
		router.push("/dashboard/home");
	};

	return (
		<div className="w-full mx-auto pt-5 border-b border-gray01 pb-1 flex items-center px-3">
			<h2 className="text-green02 font-bold text-sm">シフト提出依頼の作成</h2>
			<button
				type="button"
				className="btn btn-sm btn-link text-gray-500 ml-auto"
				onClick={saveDraftShiftRequest}
			>
				下書き保存
			</button>
		</div>
	);
};

export default FormHead;
