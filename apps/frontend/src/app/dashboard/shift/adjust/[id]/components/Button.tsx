"use client";
import { useUpsertAssignShift } from "@/app/api/hook/useUpsertAssignShift";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import type { UpsertAssignShfitInput } from "@shared/api/shift/assign/validations/put";
import React from "react";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";

const Button = () => {
	const { upsertAssignShift } = useUpsertAssignShift();
	const { assignShiftData } = useAdjustShiftForm();
	const { showToast } = useToast();

	const handleUpsertAssignShift = async () => {
		const upsertData: UpsertAssignShfitInput = {
			shiftRequestId: assignShiftData.shiftRequestId,
			status: "ADJUSTMENT",
			shifts: assignShiftData.shifts,
		};
		const res = await upsertAssignShift({
			upsertData,
			shiftRequestId: assignShiftData.shiftRequestId,
		});
		if (!res.ok) {
			if ("errors" in res) {
				res.errors.map((error) => {
					showToast(error.message, "error");
				});
				return;
			}
			showToast("シフトの保存に失敗しました", "error");
			return;
		}
		if (res.ok) {
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
				onClick={handleUpsertAssignShift}
			>
				調整を確定
			</button>
		</div>
	);
};

export default Button;
