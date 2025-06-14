"use client";
import type { RootState } from "@/app/redux/store";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { useSelector } from "react-redux";
import { useRegisterLoadingUI } from "../../common/context/useRegisterLoadingUI";

export enum RegisterStep {
	Auth = 0,
	Register = 1,
	InviteBot = 2,
}
export type RegisterUIContextType = {
	step: RegisterStep;
	changeInviteBotStep: () => void;
};

const registerUIContext = createContext<RegisterUIContextType | undefined>(
	undefined,
);

export const useRegisterSteps = () => {
	const context = useContext(registerUIContext);
	if (context === undefined) {
		throw new Error(
			"useRegisterStep must be used within a IsRegisterProviderStep",
		);
	}
	return context;
};

export const RegisterStepsProvider = ({
	children,
}: { children: ReactNode }) => {
	const [step, setStep] = useState<RegisterStep>(RegisterStep.Auth);
	const { user } = useSelector((state: RootState) => state.user);
	const token = useSelector((state: RootState) => state.token);
	const { setPageLoading } = useRegisterLoadingUI();

	useEffect(() => {
		if (token.userToken && token.storeToken) {
			setStep(RegisterStep.InviteBot);
			setPageLoading(false);
			return;
		}
		if (user?.lineId) {
			setStep(RegisterStep.Register);
			setPageLoading(false);
			return;
		}
	}, [user?.lineId, token.userToken, token.storeToken, setPageLoading]);

	function changeInviteBotStep() {
		setStep(RegisterStep.InviteBot);
	}

	return (
		<registerUIContext.Provider value={{ step, changeInviteBotStep }}>
			{children}
		</registerUIContext.Provider>
	);
};
