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

// export const dummyShiftRequestData: ShiftRequestDTO = {
// 	id: "sr1",
// 	storeId: "shop1",
// 	weekStart: new Date("2025-10-20T00:00:00.000Z"),
// 	weekEnd: new Date("2025-11-02T00:00:00.000Z"),
// 	deadline: new Date("2025-10-15T00:00:00.000Z"),
// 	status: "ADJUSTMENT",
// 	createdAt: new Date("2024-06-01T12:00:00Z"),
// 	updatedAt: new Date("2024-06-01T12:00:00Z"),
// 	requests: {
// 		"2025-10-20": {
// 			"05:00-08:30": {
// 				name: "あさ",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-21": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-22": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-23": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-24": null,
// 		"2025-10-25": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-26": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-27": null,
// 		"2025-10-28": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-29": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-30": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-10-31": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-11-01": {
// 			"05:00-08:30": {
// 				name: "テスト",
// 				count: 2,
// 				absolute: [],
// 				jobRoles: [],
// 				priority: [],
// 			},
// 		},
// 		"2025-11-02": null,
// 	},

// 	type: "WEEKLY",
// };

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
