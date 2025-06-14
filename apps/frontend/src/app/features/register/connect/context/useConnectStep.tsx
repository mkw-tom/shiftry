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

export enum ConnectStep {
	NotConnect = 0,
	Connected = 1,
}
export type connectStepContextType = {
	step: ConnectStep;
	changeConnectedStep: () => void;
};

const connectStepContext = createContext<connectStepContextType | undefined>(
	undefined,
);

export const useConnectSteps = () => {
	const context = useContext(connectStepContext);
	if (context === undefined) {
		throw new Error("useIsConnect must be used within a IsConnectProvider");
	}
	return context;
};

export const ConnectStepsProvider = ({ children }: { children: ReactNode }) => {
	const [step, setStep] = useState<ConnectStep>(ConnectStep.NotConnect);
	const token = useSelector((state: RootState) => state.token);
	const { setPageLoading } = useRegisterLoadingUI();

	useEffect(() => {
		if (token.connectedGroup === true) {
			setStep(ConnectStep.Connected);
			setPageLoading(false);
			return;
		}
		setPageLoading(false);
	}, [token.connectedGroup, setPageLoading]);

	function changeConnectedStep() {
		setStep(ConnectStep.Connected);
	}

	return (
		<connectStepContext.Provider value={{ step, changeConnectedStep }}>
			{children}
		</connectStepContext.Provider>
	);
};
