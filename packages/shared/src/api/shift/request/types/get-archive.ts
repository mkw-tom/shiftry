import type { ShiftRequest } from "../../../common/types/prisma.js";

export type GetArchiveShiftRequestsResponse = {
	ok: true;
	archiveShiftRequests: ShiftRequest[];
};
