"use client";
import type { UpsertShiftRequetType } from "@shared/api/shift/request/validations/put";
import { type ReactNode, createContext, useContext, useState } from "react";

type CreateRequestContextType = {
	step: CreateRequestStep;
	setStep: React.Dispatch<React.SetStateAction<CreateRequestStep>>;
	nextStep: () => void;
	prevStep: () => void;
	formData: UpsertShiftRequetType;
	setFormData: React.Dispatch<React.SetStateAction<UpsertShiftRequetType>>;
};

export enum CreateRequestStep {
	Period = 0,
	Weekly = 1,
	Special = 2,
}

export const formDataInit = {
	type: "WEEKLY",
	weekStart: "",
	weekEnd: "",
	deadline: "",
	status: "HOLD",
	requests: {
		defaultTimePositions: {
			Monday: [],
			Tuesday: [],
			Wednesday: [],
			Thursday: [],
			Friday: [],
			Saturday: [],
			Sunday: [],
		},
		overrideDates: {},
	},
} as UpsertShiftRequetType;

const createRequestContext = createContext<
	CreateRequestContextType | undefined
>(undefined);

export const useCreateRequest = () => {
	const context = useContext(createRequestContext);
	if (context === undefined) {
		throw new Error(
			"useCreateRequest must be used within a CreateRequestProvider",
		);
	}
	return context;
};

export const CreateRequestProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [step, setStep] = useState<CreateRequestStep>(CreateRequestStep.Period);
	const [formData, setFormData] = useState<UpsertShiftRequetType>(formDataInit);

	function nextStep() {
		setStep((prev) =>
			prev === CreateRequestStep.Period
				? CreateRequestStep.Weekly
				: CreateRequestStep.Special,
		);
	}

	function prevStep() {
		setStep((prev) =>
			prev === CreateRequestStep.Special
				? CreateRequestStep.Weekly
				: CreateRequestStep.Period,
		);
	}

	return (
		<createRequestContext.Provider
			value={{
				step,
				setStep,
				nextStep,
				prevStep,
				formData,
				setFormData,
			}}
		>
			{children}
		</createRequestContext.Provider>
	);
};
