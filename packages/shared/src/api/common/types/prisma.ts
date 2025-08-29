// export * from "../../../../../apps/backend/src/types/prisma";
export type {
	User,
	Store,
	UserStore,
	ShiftRequest,
	SubmittedShift,
	AssignShift,
	Payment,
	ShiftPosition,
	JobRole,
	UserJobRole,
	StoreCode,
} from "@prisma/client";

export type {
	UserRole,
	ShiftStatus,
	ShiftType,
	RequestStatus,
} from "@prisma/client";

export const SHIFT_STSTUS = ["ADJUSTMENT", "CONFIRMED"] as const;

export const SHIFT_TYPE = ["MONTHLY", "WEEKLY"] as const;
export const REQUEST_STATUS = [
	"HOLD",
	"REQUEST",
	"ADJUSTMENT",
	"CONFIRMED",
] as const;
