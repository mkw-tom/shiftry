import { error } from "node:console";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import type { RequestShiftMessageType } from "@shared/api/webhook/line/validatioins";
import { useRouter } from "next/navigation";
import React from "react";
import { useBulkUpsertShiftPositions } from "../api/bulk-upsert-shift-positions/hook";
import { useSendShiftReqeust } from "../api/send-shift-request-line/hook";
import { useUpsertShiftReqeust } from "../api/upsert-shift-request/hook";
import { useCreateRequest } from "../context/useCreateRequest";

const ActionButton = () => {
	const { step, nextStep, prevStep, formData, setFormData, shiftPositioins } =
		useCreateRequest();
	const { handleUpsertShiftRequest } = useUpsertShiftReqeust();
	const { handleSendShiftRequest } = useSendShiftReqeust();
	const { handleBulkUpsertShiftPositions } = useBulkUpsertShiftPositions();
	const { showToast } = useToast();
	const router = useRouter();

	const saveAndSnedToShiftRequest = async () => {
		setFormData({ ...formData, status: "CONFIRMED" });
		const res = await handleUpsertShiftRequest(formData);
		if (!res.ok) {
			showToast("シフトリクエストの作成に失敗しました", "error");
			alert(res.message);
			return;
		}

		const sendData: RequestShiftMessageType = {
			deadline: String(res.shiftRequest.deadline),
			shiftRequestId: res.shiftRequest.id,
			startDate: String(res.shiftRequest.weekStart),
			endDate: String(res.shiftRequest.weekEnd),
		};

		const sendRes = await handleSendShiftRequest({ sendData: sendData });
		if (!sendRes.ok) {
			showToast("LINE通知の送信に失敗しました", "error");
			alert(sendRes.message);
			return;
		}
		nextStep();
		showToast("リクエストが作成されました", "success");
		router.push("/dashboard/home");
	};

	const saveShiftPositionsData = async () => {
		const res = await handleBulkUpsertShiftPositions(shiftPositioins);
		if (!res.ok && "message" in res) {
			showToast("シフトポジションの保存に失敗しました", "error");
			alert(res.message);
			return;
		}
		showToast("シフトポジションを保存しました", "success");
		nextStep();
	};

	if (step === "select_date") {
		return (
			<div className="absolute bottom-5 left-0 right-0 w-full mx-auto flex justify-center bg-base  px-3 pb-5 pt-3">
				<button
					type="button"
					className="btn w-full bg-green02 text-white border-none"
					onClick={nextStep}
				>
					次へ
				</button>
			</div>
		);
	}

	if (step === "regist_position") {
		return (
			<div className="absolute bottom-5 left-0 right-0 w-full mx-auto flex justify-between gap-1 bg-base  px-3 pb-5 pt-3">
				<button
					type="button"
					className="btn w-1/3 bg-gray02 text-white border-none"
					onClick={prevStep}
				>
					戻る
				</button>
				<button
					type="button"
					className="btn w-2/3 bg-green02 text-white border-none"
					onClick={saveShiftPositionsData}
				>
					次へ
				</button>
			</div>
		);
	}

	if (step === "adjust_position") {
		return (
			<div className="absolute bottom-5 left-0 right-0 w-full mx-auto flex justify-between bg-base gap-1 px-3 pb-5 pt-3">
				<button
					type="button"
					className="btn w-1/3 bg-gray02 text-white border-none"
					onClick={prevStep}
				>
					戻る
				</button>
				<button
					type="button"
					className="btn w-2/3 bg-green02 text-white border-none"
					onClick={saveAndSnedToShiftRequest}
				>
					シフト提出を依頼
				</button>
			</div>
		);
	}
	// if (step === "preview") {
	// 	return (
	// 		<div className="absolute bottom-5 left-0 right-0 w-full mx-auto flex justify-between bg-base gap-1 px-3 pb-5 pt-3">
	// 			<button
	// 				type="button"
	// 				className="btn w-1/3 bg-gray02 text-white border-none"
	// 				onClick={prevStep}
	// 			>
	// 				戻る
	// 			</button>
	// 			<button
	// 				type="button"
	// 				className="btn w-2/3 bg-green02 text-white border-none"
	// 				onClick={nextStep}
	// 			>
	// 				シフト提出を依頼
	// 			</button>
	// 		</div>
	// 	);
	// }
};

export default ActionButton;
