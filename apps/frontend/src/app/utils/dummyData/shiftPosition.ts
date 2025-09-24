import type { ShiftPositionDTO } from "@shared/api/shiftPosition/dto";

export const dummyShiftPositions: ShiftPositionDTO[] = [
	{
		id: "pos1",
		name: "Cashier",
		startTime: new Date("2025-08-29T21:30:00.078Z"),
		endTime: new Date("2025-08-29T23:30:00.289Z"),
		count: 2,
		jobRoles: ["CASHIER"],
		weeks: ["monday", "tuesday", "wednesday", "thursday", "friday"],
		priority: [],
		absolute: [],
	},
	{
		id: "pos2",
		name: "Cook",
		startTime: new Date("2025-08-30T03:00:00.000Z"),
		endTime: new Date("2025-08-30T09:00:00.000Z"),
		count: 1,
		jobRoles: ["COOK"],
		weeks: ["monday", "tuesday", "wednesday", "thursday", "friday"],
		priority: [],
		absolute: [],
	},
];
