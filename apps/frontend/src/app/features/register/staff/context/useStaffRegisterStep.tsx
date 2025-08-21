// import { generateLineLoginUrl } from "@/app/lib/line";
// import type { storeIdandShfitReruestIdType } from "@shared/api/auth/validations/register-staff";
// import { type ReactNode, createContext, useContext, useState } from "react";
// import { usePostRegisterStaff } from "../api/registerStaff/hook";
// import { postRegisterStaff } from "../api/registerStaff/registerStaff";

// type StaffRegisterStepContextType = {
// 	step: StaffRegisterStepType;
// 	stepLoading: boolean;
// 	changeStep: (
// 		name?: string,
// 		storeInput?: storeIdandShfitReruestIdType,
// 	) => void;
// };

// const StaffRegisterStepContext = createContext<
// 	undefined | StaffRegisterStepContextType
// >(undefined);

// export type StaffRegisterStepType = "LINE_AUTH" | "REGIST" | "SUCCESS_REGIST";

// export const useStaffRegisterStep = () => {
// 	const context = useContext(StaffRegisterStepContext);
// 	if (context === undefined) {
// 		throw new Error(
// 			"useStaffRegisterStep must be used within a StaffRegisterStepProvider",
// 		);
// 	}
// 	return context;
// };

// export const StaffRegisterStepProvider = ({
// 	children,
// }: {
// 	children: ReactNode;
// }) => {
// 	const [step, setStep] = useState<StaffRegisterStepType>("LINE_AUTH");
// 	const [stepLoading, setStepLoading] = useState(false);
// 	const { handleRegisterStaff } = usePostRegisterStaff();

// 	function handleLineLogin() {
// 		window.location.href = generateLineLoginUrl("STAFF", "register");
// 	}

// 	const changeStep = async (
// 		name?: string,
// 		storeInput?: storeIdandShfitReruestIdType,
// 	) => {
// 		switch (step) {
// 			case "LINE_AUTH":
// 				setStepLoading(true);
// 				handleLineLogin();
// 				setStep("REGIST");
// 				setStepLoading(false);
// 				break;
// 			case "REGIST": {
// 				setStepLoading(true);
// 				if (!name) {
// 					throw new Error("Name is required for registration");
// 				}
// 				if (!storeInput) {
// 					throw new Error("Store input is required for registration");
// 				}
// 				const res = await handleRegisterStaff({ name, storeInput });
// 				if (res.ok === false) {
// 					setStepLoading(false);
// 					window.location.reload();
// 					break;
// 				}
// 				setStep("SUCCESS_REGIST");
// 				setStepLoading(false);
// 				break;
// 			}
// 			case "SUCCESS_REGIST":
// 				setStep("SUCCESS_REGIST");
// 				break;
// 			default:
// 				throw new Error("Invalid step type");
// 		}
// 	};

// 	const values = {
// 		step,
// 		stepLoading,
// 		changeStep,
// 	};

// 	return (
// 		<StaffRegisterStepContext.Provider value={values}>
// 			{children}
// 		</StaffRegisterStepContext.Provider>
// 	);
// };
