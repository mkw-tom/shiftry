"use client";
import type { UpsertShiftRequetInput } from "@shared/api/shift/request/validations/put";
import type { bulkUpsertShiftPositionInput } from "@shared/api/shiftPosition/validations/put-bulk";
import { useRouter } from "next/navigation";
import { type ReactNode, createContext, useContext, useState } from "react";

type CreateRequestContextType = {
	step: CreateRequestStep;
	setStep: React.Dispatch<React.SetStateAction<CreateRequestStep>>;
	nextStep: () => void;
	prevStep: () => void;
	formData: UpsertShiftRequetInput;
	setFormData: React.Dispatch<React.SetStateAction<UpsertShiftRequetInput>>;
	shiftPositioins: bulkUpsertShiftPositionInput;
	setShiftPositions: React.Dispatch<
		React.SetStateAction<bulkUpsertShiftPositionInput>
	>;
	allJobRoles: string[];
	setAllJobRoles: React.Dispatch<React.SetStateAction<string[]>>;
};

export type CreateRequestStep =
	| "select_date"
	| "regist_position"
	| "go_to_adjust_page";

export const formDataInit: UpsertShiftRequetInput = {
	type: "WEEKLY",
	weekStart: "",
	weekEnd: "",
	deadline: "",
	status: "HOLD",
	requests: {},
};

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
	const router = useRouter();
	const [step, setStep] = useState<CreateRequestStep>("select_date");
	const [formData, setFormData] =
		useState<UpsertShiftRequetInput>(formDataInit);
	const [shiftPositioins, setShiftPositions] =
		useState<bulkUpsertShiftPositionInput>([]);
	const [allJobRoles, setAllJobRoles] = useState<string[]>([]);

	const nextStep = async () => {
		switch (step) {
			case "select_date":
				setStep("regist_position");
				break;
			case "regist_position":
				setStep("go_to_adjust_page");
				break;
			default:
				throw new Error("Unknown step");
		}
	};

	function prevStep() {
		switch (step) {
			case "regist_position":
				setStep("select_date");
				break;
			case "go_to_adjust_page":
				setStep("regist_position");
				break;
			default:
				throw new Error("Cannot go back from this step");
		}
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
				shiftPositioins,
				setShiftPositions,
				allJobRoles,
				setAllJobRoles,
			}}
		>
			{children}
		</createRequestContext.Provider>
	);
};
