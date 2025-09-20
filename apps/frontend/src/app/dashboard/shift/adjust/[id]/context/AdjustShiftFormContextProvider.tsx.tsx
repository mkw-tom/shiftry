"use client";
import {
	dummyAssignShift,
	dummyAssignShiftInput,
} from "@/app/utils/dummyData/AssginShfit";
import { dummyShiftRequest } from "@/app/utils/dummyData/ShiftRequest";
import { dummySubmittedShiftList } from "@/app/utils/dummyData/SubmittedShifts";
import type { AssignShiftDTO } from "@shared/api/shift/assign/dto";
import { UpsertAssignShfitInput } from "@shared/api/shift/assign/validations/put";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import type { SubmittedShiftDTO } from "@shared/api/shift/submit/dto";
import { createContext, useContext, useEffect, useState } from "react";

type ContextType = {
	// upsertAssingShiftInput: UpsertAssignShfitInput;
	// setUpsertAssingShiftInput: React.Dispatch<
	//   React.SetStateAction<UpsertAssignShfitInput>
	// >;
	shiftRequestData: ShiftRequestDTO;
	setShiftRequestData: React.Dispatch<React.SetStateAction<ShiftRequestDTO>>;
	assignShiftData: AssignShiftDTO;
	setAssignShiftData: React.Dispatch<React.SetStateAction<AssignShiftDTO>>;
	submittedShiftList: SubmittedShiftDTO[];
	setSubmittedShiftList: React.Dispatch<
		React.SetStateAction<SubmittedShiftDTO[]>
	>;
	allJobRoles: string[];
	setAllJobRoles: React.Dispatch<React.SetStateAction<string[]>>;
};
const adjustShiftFormContext = createContext<ContextType | undefined>(
	undefined,
);

export const AdjustShiftFormContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [assignShiftData, setAssignShiftData] =
		useState<AssignShiftDTO>(dummyAssignShift);
	const [shiftRequestData, setShiftRequestData] =
		useState<ShiftRequestDTO>(dummyShiftRequest);
	const [submittedShiftList, setSubmittedShiftList] = useState<
		SubmittedShiftDTO[]
	>(dummySubmittedShiftList);
	const [allJobRoles, setAllJobRoles] = useState<string[]>([
		"レジ",
		"品出し",
		"接客",
		"清掃",
		"レジ締め",
		"レジ管理",
	]);

	return (
		<adjustShiftFormContext.Provider
			value={{
				shiftRequestData,
				setShiftRequestData,
				assignShiftData,
				setAssignShiftData,
				submittedShiftList,
				setSubmittedShiftList,
				allJobRoles,
				setAllJobRoles,
			}}
		>
			{children}
		</adjustShiftFormContext.Provider>
	);
};

export const useAdjustShiftForm = () => {
	const context = useContext(adjustShiftFormContext);
	if (context === undefined) {
		throw new Error(
			"useAdjustShiftFormContext must be used within a AdjustShiftFormContextProvider",
		);
	}
	return context;
};
