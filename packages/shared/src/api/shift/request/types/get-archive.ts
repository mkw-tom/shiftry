import type { ShiftRequestDTO } from "../dto.js";

export type GetArchiveShiftRequestsResponse = {
	ok: true;
	archiveShiftRequests: ShiftRequestDTO[];
};
