"use client";
import type { AssignShiftDTO } from "@shared/api/shift/assign/dto";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import type { SubmittedShiftDTO } from "@shared/api/shift/submit/dto";
import type { StaffPreferenceDTO } from "@shared/api/staffPreference/dto";
import { createContext, useContext, useState } from "react";

type ContextType = {
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
	staffPreferences: StaffPreferenceDTO[];
	setStaffPreferences: React.Dispatch<
		React.SetStateAction<StaffPreferenceDTO[]>
	>;
};
const adjustShiftFormContext = createContext<ContextType | undefined>(
	undefined,
);

export const AdjustShiftFormContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [assignShiftData, setAssignShiftData] = useState<AssignShiftDTO>({
		id: "",
		storeId: "",
		shiftRequestId: "",
		shifts: {},
		status: "ADJUSTMENT",
		createdAt: new Date(),
		updatedAt: new Date(),
	});
	const [shiftRequestData, setShiftRequestData] = useState<ShiftRequestDTO>({
		id: "",
		storeId: "",
		type: "MONTHLY",
		weekStart: new Date(),
		weekEnd: new Date(),
		deadline: new Date(),
		requests: {},
		status: "CONFIRMED",
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const [submittedShiftList, setSubmittedShiftList] = useState<
		SubmittedShiftDTO[]
	>([]);
	const [staffPreferences, setStaffPreferences] = useState<
		StaffPreferenceDTO[]
	>([]);

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
				staffPreferences,
				setStaffPreferences,
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
