import type { Prisma } from "@prisma/client";
import type { SubmittedShift } from "@shared/api/common/types/prisma.js";
import type { UpsertSubmittedShiftInput } from "@shared/api/shift/submit/validations/put.js";
// import type { UpsertSubmittedShiftWithShifts } from "@shared/api/shift/submit/validations/put.js";
import prisma from "../config/database.js";

export const upsertSubmittedShift = async (
	userId: string,
	storeId: string,
	data: UpsertSubmittedShiftInput,
): Promise<SubmittedShift> => {
	return await prisma.submittedShift.upsert({
		where: {
			userId_shiftRequestId: {
				userId: userId,
				shiftRequestId: data.shiftRequestId,
			},
		},
		update: {
			shifts: data.shifts,
			memo: data.memo,
			status: data.status,
		},
		create: {
			userId: userId,
			storeId: storeId,
			shiftRequestId: data.shiftRequestId,
			shifts: data.shifts,
			memo: data.memo,
			status: data.status,
		},
	});
};

export const getSubmittedShiftUser = async (
	userId: string,
	storeId: string,
): Promise<SubmittedShift[]> => {
	return await prisma.submittedShift.findMany({
		where: { userId, storeId },
	});
};
export const getSubmittedShiftUserOne = async (
	userId: string,
	shiftRequestId: string,
): Promise<SubmittedShift | null> => {
	return await prisma.submittedShift.findUnique({
		where: {
			userId_shiftRequestId: {
				userId,
				shiftRequestId,
			},
		},
	});
};

export const getSubmittedShiftsSpecific = async (
	shiftRequestId: string,
): Promise<SubmittedShift[]> => {
	return await prisma.submittedShift.findMany({
		where: { shiftRequestId },
		include: {
			user: {
				select: {
					jobRoles: {
						select: {
							roleId: true,
							role: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			},
		},
	});
};
