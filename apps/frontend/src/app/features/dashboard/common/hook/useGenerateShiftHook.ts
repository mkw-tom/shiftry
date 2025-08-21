// "use client";
// import { useRouter } from "next/navigation";
// import { useGenerateShiftWithAI } from "../api/generate-shift-ai/hook";
// import { useBottomDrawer } from "../context/useBottomDrawer";
// import { useGenareteShift } from "../context/useGenerateShift";

// export const useGenerateShiftHook = () => {
// 	const router = useRouter();
// 	const { handleGenerateShiftWithAI } = useGenerateShiftWithAI();
// 	const { currentData, drawerClose } = useBottomDrawer();
// 	const { step, setStep, submittedDatas, ownerRequests, setFormData } =
// 		useGenareteShift();

// 	const nextStep = async () => {
// 		switch (step) {
// 			case "PREVIEW_SUBMITS":
// 				setStep("INPUT_REQUESTS");
// 				break;

// 			case "INPUT_REQUESTS": {
// 				if (
// 					!currentData?.id ||
// 					!currentData?.weekStart ||
// 					!currentData?.weekEnd
// 				)
// 					return;

// 				const form = {
// 					shiftRequestId: currentData.id,
// 					startDate: String(currentData.weekStart),
// 					endDate: String(currentData.weekEnd),
// 					shiftRequest: currentData.requests ?? {
// 						defaultTimePositions: {
// 							Monday: [],
// 							Tuesday: [],
// 							Wednesday: [],
// 							Thursday: [],
// 							Friday: [],
// 							Saturday: [],
// 							Sunday: [],
// 						},
// 						overrideDates: {},
// 					},
// 					submittedShifts: submittedDatas.submittedShifts.map((shift) => ({
// 						name: shift.name as string,
// 						userId: shift.userId,
// 						weekCountMin: shift.shifts.weekCountMin,
// 						weekCountMax: shift.shifts.weekCountMax,
// 						availableWeeks: shift.shifts.availableWeeks,
// 						specificDates: shift.shifts.specificDates,
// 					})),
// 					ownerRequests,
// 				};
// 				console.log("Form Data:", form);

// 				setFormData(form);
// 				await handleGenerateShiftWithAI({ formData: form });
// 				setStep("GENERATE");
// 				break;
// 			}

// 			case "GENERATE":
// 				router.push(`/dashboard/shift/${currentData?.id}`);
// 				drawerClose();
// 				break;

// 			default:
// 				console.log("ステップがありません");
// 		}
// 	};

// 	const prevStep = () => {
// 		setStep((prev) =>
// 			prev === "GENERATE" ? "INPUT_REQUESTS" : "PREVIEW_SUBMITS",
// 		);
// 	};

// 	return { nextStep, prevStep };
// };
