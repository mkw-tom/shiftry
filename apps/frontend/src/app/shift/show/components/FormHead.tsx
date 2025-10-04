"use client";
import { useUpsertAssignShift } from "@/app/api/hook/useUpsertAssignShift";
import { useUpsertShiftReqeust } from "@/app/api/hook/useUpsertShiftReqeust";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import type { RootState } from "@/redux/store.js";
import type { UpsertAssignShfitInput } from "@shared/api/shift/assign/validations/put";
import type { UpsertShiftRequetInput } from "@shared/api/shift/request/validations/put";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";

const FormHead = () => {
	const { upsertAssignShift } = useUpsertAssignShift();
	const { assignShiftData, shiftRequestData } = useAdjustShiftForm();
	const { upsertShiftRequest } = useUpsertShiftReqeust();
	const { showToast } = useToast();
	const { user } = useSelector((state: RootState) => state.user);

	const handleUpsertDraftShiftData = async () => {
		const upsertAssignShiftData: UpsertAssignShfitInput = {
			shiftRequestId: assignShiftData.shiftRequestId,
			status: "ADJUSTMENT",
			shifts: assignShiftData.shifts,
		};
		const asRes = await upsertAssignShift({
			upsertData: upsertAssignShiftData,
			shiftRequestId: assignShiftData.shiftRequestId,
		});
		if (!asRes.ok) {
			if ("errors" in asRes) {
				asRes.errors.map((error) => {
					showToast(error.message, "error");
				});
				return;
			}
			showToast("シフトの保存に失敗しました", "error");
			return;
		}

		const upsertShiftRequestData: UpsertShiftRequetInput = {
			type: shiftRequestData.type,
			requests: shiftRequestData.requests,
			status: shiftRequestData.status,
			weekEnd: String(shiftRequestData.weekEnd),
			weekStart: String(shiftRequestData.weekStart),
			deadline: String(shiftRequestData.deadline),
		};
		const srRes = await upsertShiftRequest({
			formData: upsertShiftRequestData,
			shiftRequestId: assignShiftData.shiftRequestId,
		});
		if (!srRes.ok) {
			if ("errors" in srRes) {
				srRes.errors.map((error) => {
					showToast(error.message, "error");
				});
				return;
			}
			showToast("シフトの保存に失敗しました", "error");
			return;
		}

		if (srRes.ok && asRes.ok) {
			showToast("シフトを保存しました", "success");
		}
	};

	if (shiftRequestData.status === "CONFIRMED" || user?.role === "STAFF")
		return <div className="pt-4" />;

	return (
		<div className="w-full mx-auto pt-5 border-b border-gray01 pb-1 flex items-center px-3">
			<h2 className="text-green02 font-bold text-sm ">シフト調整</h2>
			<button
				type="button"
				className="btn btn-sm btn-link text-gray-500 ml-auto"
				onClick={handleUpsertDraftShiftData}
			>
				下書き保存
			</button>
		</div>
	);
};

export default FormHead;
