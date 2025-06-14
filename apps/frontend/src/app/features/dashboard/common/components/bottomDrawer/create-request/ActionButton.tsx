import { saveShiftRequest } from "@/app/redux/slices/shiftRequests";
import type { AppDispatch, RootState } from "@/app/redux/store";
import { RequestStatus } from "@shared/common/types/prisma";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { string } from "zod";
import { useSendShiftReqeust } from "../../../api/send-shift-request-line/hook";
import { useUpsertShiftReqeust } from "../../../api/upsert-shift-request/hook";
import { DrawerView, useBottomDrawer } from "../../../context/useBottomDrawer";
import {
	CreateRequestStep,
	useCreateRequest,
} from "../../../context/useCreateRequest";

const ActionButton = () => {
	const { view, currentData, drawerClose } = useBottomDrawer();
	const { step, setStep, formData } = useCreateRequest();
	const { handleUpsertShiftRequest } = useUpsertShiftReqeust();
	const { handleSendShiftRequest } = useSendShiftReqeust();
	const dispatch = useDispatch<AppDispatch>();

	const { userToken, storeToken, groupToken } = useSelector(
		(state: RootState) => state.token,
	);

	function testSave() {
		// Transform formData to match the expected type for saveShiftRequest
		if (!formData.weekStart) {
			return alert("週の開始日がありません");
		}
		const transformedData = {
			...formData,
			weekStart: new Date(formData.weekStart),
			weekEnd: formData.weekEnd ? new Date(formData.weekEnd) : null,
			deadline: formData.deadline ? new Date(formData.deadline) : null,
			requests: formData.requests, // keep as object if expected type is JsonValue
			id: "",
			storeId: "",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		dispatch(saveShiftRequest(transformedData));
		if (confirm("lineグループに提出依頼を送信しますか？")) {
			const transformedDataWithStatus = {
				...formData,
				weekStart: new Date(formData.weekStart),
				weekEnd: formData.weekEnd ? new Date(formData.weekEnd) : null,
				deadline: formData.deadline ? new Date(formData.deadline) : null,
				requests: formData.requests,
				id: "",
				storeId: "",
				createdAt: new Date(),
				updatedAt: new Date(),
				status: RequestStatus.REQUEST,
			};
			dispatch(saveShiftRequest(transformedDataWithStatus));
		}
	}

	async function saveShiftReqeust(
		userToken: string | null,
		storeToken: string | null,
		groupToken: string | null,
	) {
		if (!userToken || !storeToken || !groupToken) {
			return alert("トークン情報がありません");
		}
		if (confirm("lineグループにシフト提出を依頼しますか？")) {
			const updateStatusFormData = {
				...formData,
				status: RequestStatus.REQUEST,
			};
			await handleUpsertShiftRequest({
				userToken,
				storeToken,
				formData: updateStatusFormData,
			});
			await handleSendShiftRequest({ userToken, storeToken, groupToken });
			return;
		}
		await handleUpsertShiftRequest({ userToken, storeToken, formData });
	}

	async function changeFormStep(
		step: CreateRequestStep,
		directoiin?: "next" | "prev",
	) {
		switch (step) {
			case CreateRequestStep.Period:
				setStep(CreateRequestStep.Weekly);
				break;
			case CreateRequestStep.Weekly:
				if (directoiin === "prev") {
					setStep(CreateRequestStep.Period);
					return;
				}
				setStep(CreateRequestStep.Special);
				break;
			case CreateRequestStep.Special:
				if (directoiin === "prev") {
					setStep(CreateRequestStep.Weekly);
					return;
				}
				testSave();
				// await saveShiftReqeust(userToken, storeToken, groupToken);
				drawerClose();
				setStep(CreateRequestStep.Period);
				console.log("Submitting form with data:", formData);
				break;
			default:
				break;
		}
	}

	function handleBtnTextAndStyle(step: CreateRequestStep) {
		switch (step) {
			case CreateRequestStep.Period: {
				const { weekEnd, weekStart, deadline, type } = formData;
				return {
					text: "次へ",
					color: "bg-green01",
					disabled: !(weekEnd && weekStart && deadline && type),
				};
			}
			case CreateRequestStep.Weekly: {
				const { requests } = formData;
				const days: (keyof typeof requests.defaultTimePositions)[] = [
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
					"Sunday",
				];
				return {
					text: "次へ",
					color: "bg-green01",
					disabled: !days.some(
						(day) => requests.defaultTimePositions[day].length > 0,
					),
				};
			}
			case CreateRequestStep.Special:
				return {
					text: "データを保存",
					color: "bg-green01",
					disabled: false,
				};
			default:
				return { text: "操作を選択", color: "bg-green01", disabled: false };
		}
	}

	return (
		<div className="w-full flex items-center justify-between mx-auto mb-5">
			{step !== CreateRequestStep.Period && (
				<button
					type="button"
					className="btn w-1/3 h-10 bg-gray02 shadow-xl rounded-full font-bold text-sm text-white border-none mr-2"
					onClick={() => changeFormStep(step, "prev")}
				>
					前へ戻る
				</button>
			)}
			<button
				type="button"
				className={`btn flex-1 h-10 ${
					handleBtnTextAndStyle(step).color
				} shadow-xl rounded-full font-bold text-sm text-white border-none`}
				onClick={() => changeFormStep(step, "next")}
				disabled={handleBtnTextAndStyle(step).disabled}
			>
				{handleBtnTextAndStyle(step).text}
			</button>
		</div>
	);
};

export default ActionButton;
