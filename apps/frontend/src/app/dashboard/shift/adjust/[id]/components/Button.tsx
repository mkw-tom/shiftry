"use client";
import { useUpsertAssignShift } from "@/app/api/hook/useUpsertAssignShift";
import { useUpsertShiftReqeust } from "@/app/api/hook/useUpsertShiftReqeust";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import type { UpsertAssignShfitInput } from "@shared/api/shift/assign/validations/put";
import type { UpsertShiftRequetInput } from "@shared/api/shift/request/validations/put.js";
import React from "react";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";

const Button = () => {
	const { upsertAssignShift } = useUpsertAssignShift();
	const { assignShiftData, shiftRequestData } = useAdjustShiftForm();
	const { upsertShiftRequest } = useUpsertShiftReqeust();
	const { showToast } = useToast();

	const handleUpsertShiftData = async () => {
		const upsertAssignShiftData: UpsertAssignShfitInput = {
			shiftRequestId: assignShiftData.shiftRequestId,
			status: "CONFIRMED",
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
			status: "CONFIRMED",
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

	return (
		<div className="absolute bottom-5 left-0 right-0 w-full mx-auto flex justify-center bg-base  px-3 pb-5 pt-3 gap-1">
			<button
				type="button"
				className="btn w-2/5 bg-gray02 text-white border-none"
			>
				{/* <PiMegaphoneSimple className="text-[14px]"/> */}
				欠員ヘルプ通知
			</button>
			<button
				type="button"
				className="btn w-3/5 bg-green02 text-white border-none"
				onClick={handleUpsertShiftData}
			>
				調整を確定
			</button>
		</div>
	);
};

export default Button;
