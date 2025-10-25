import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { TEST_MODE } from "@/lib/env";
import type { UpsertShiftRequetInput } from "@shared/api/shift/request/validations/put";
import type { bulkUpsertShiftPositionInput } from "@shared/api/shiftPosition/validations/put-bulk";
import type { RequestShiftMessageType } from "@shared/api/webhook/line/validatioins";
import next from "next";
import { useRouter } from "next/navigation";
import type React from "react";
import { Dispatch, SetStateAction } from "react";
import { useBulkUpsertJobroles } from "../api/bulk-upsert-jobrole/hook";
import { useBulkUpsertShiftPositions } from "../api/bulk-upsert-shift-positions/hook";
import { useSendShiftReqeust } from "../api/send-shift-request-line/hook";
import { useUpsertShiftReqeust } from "../api/upsert-shift-request/hook";
import { buildRequestsFromPositions } from "../utils/generateRequests";

const useActionButton = ({
	formData,
	setFormData,
	shiftPositioins,
	nextStep,
	allJobRoles,
}: {
	formData: UpsertShiftRequetInput;
	setFormData: React.Dispatch<React.SetStateAction<UpsertShiftRequetInput>>;
	shiftPositioins: bulkUpsertShiftPositionInput;
	nextStep: (shiftRequestId?: string) => void;
	allJobRoles: string[];
}) => {
	const router = useRouter();
	const { handleUpsertShiftRequest } = useUpsertShiftReqeust();
	const { handleSendShiftRequest } = useSendShiftReqeust();
	const { handleBulkUpsertShiftPositions } = useBulkUpsertShiftPositions();
	const { handleBulkUpsertJobroles } = useBulkUpsertJobroles();

	const { showToast } = useToast();

	const savePositionsAndJonroles = async () => {
		const spRes = await handleBulkUpsertShiftPositions(shiftPositioins);
		if (!spRes.ok && "message" in spRes) {
			showToast("シフトポジションの保存に失敗しました", "error");
			const errorMessage =
				"errors" in spRes
					? `errorMessage: ${spRes.message} validationError: ${spRes.errors}`
					: spRes.message;
			alert(errorMessage);
			return;
		}
		const jobRolesRes = await handleBulkUpsertJobroles({ names: allJobRoles });
		if (!jobRolesRes.ok && "message" in jobRolesRes) {
			showToast("ジョブロールの保存に失敗しました", "error");
			alert(jobRolesRes.message);
			return;
		}
	};

	const saveAndSendRequest = async () => {
		const res = await handleUpsertShiftRequest({
			...formData,
			status: "ADJUSTMENT",
		});

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
		return { shiftRequest: res.shiftRequest };
	};

	const gotoAdjustPage = async () => {
		alert("シフト雛形が作成され、調整画面へ進みます。よろしいですか？");
		if (TEST_MODE) {
			showToast("雛形シフトが作成されました！調整を行ってください", "success");
			router.push("/dashboard/shift/adjust/sr1");
			nextStep("sr1");
			return;
		}

		setFormData((prev) => ({
			...prev,
			requests: buildRequestsFromPositions(prev, shiftPositioins),
		}));

		await savePositionsAndJonroles();

		const data = await saveAndSendRequest();

		router.push(`/dashboard/shift/adjust/${data?.shiftRequest.id}`);
		showToast("シフトポジションを保存しました", "success");
		nextStep(data?.shiftRequest.id);
	};

	return { gotoAdjustPage };
};

export default useActionButton;
