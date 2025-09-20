"use client";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import type { UpsertSubmittedShiftInput } from "@shared/api/shift/submit/validations/put";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

type SubmitShiftFormContextType = {
	formData: UpsertSubmittedShiftInput;
	setFormData: React.Dispatch<React.SetStateAction<UpsertSubmittedShiftInput>>;
	shiftRequestData: ShiftRequestDTO | undefined;
	setShiftRequestData: React.Dispatch<
		React.SetStateAction<ShiftRequestDTO | undefined>
	>;
};
const SubmitShiftFormContext = createContext<
	SubmitShiftFormContextType | undefined
>(undefined);

export const useSubmitShiftForm = () => {
	const context = useContext(SubmitShiftFormContext);
	if (context === undefined) {
		throw new Error(
			"useSubmitShiftForm must be used within a SubmitShiftFormContextProvider",
		);
	}
	return context;
};

export const SubmitShiftFormContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [shiftRequestData, setShiftRequestData] = useState<ShiftRequestDTO>();

	// 初期値生成: weekStart〜weekEndの全日付でshiftsを作成

	const [formData, setFormData] = useState<UpsertSubmittedShiftInput>({
		shiftRequestId: "",
		status: "ADJUSTMENT",
		shifts: {},
		memo: "",
	});

	const values = {
		formData,
		setFormData,
		shiftRequestData,
		setShiftRequestData,
	};
	return (
		<SubmitShiftFormContext.Provider value={values}>
			{children}
		</SubmitShiftFormContext.Provider>
	);
};
