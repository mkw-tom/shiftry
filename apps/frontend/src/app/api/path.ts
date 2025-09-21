import { get } from "node:http";

export const assignShiftApi = {
	index: (id?: string) => `shift/assign/${id}`,
	get: (shiftRequestId: string) => `shift/assign/${shiftRequestId}`,
	put: "shift/assign",
};

export const shiftReqeustApi = {
	index: (id?: string) => `shift/request/${id}`,
	// get: (shiftRequestId: string) => `shift/request/${shiftRequestId}`,
};

export const submittedShiftApi = {
	index: (id?: string) => `shift/submit/${id}`,
	me: "shift/submit/me",
	one: (shiftRequestId: string) => `shift/submit/one/${shiftRequestId}`,
};

export const shiftPositionApiPath = {
	bulk: "shift-position/put-bulk",
};
