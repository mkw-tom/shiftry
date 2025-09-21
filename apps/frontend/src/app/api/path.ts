import { get } from "node:http";

export const assignShiftApi = {
	base: (id?: string) => `shift/assign/${id}`,
	get: (shiftRequestId: string) => `shift/assign/${shiftRequestId}`,
	put: "shift/assign",
};

export const shiftReqeustApi = {
	base: "shift/request",
	get: (shiftRequestId: string) => `shift/request/${shiftRequestId}`,
	put: (shiftRequestId: string) => `shift/request/${shiftRequestId}`,
};

export const submittedShiftApi = {
	base: "shift/submit",
	me: "shift/submit/me",
	one: (shiftRequestId: string) => `shift/submit/one/${shiftRequestId}`,
	get: (shiftRequestId: string) => `shift/submit/${shiftRequestId}`,
};

export const shiftPositionApiPath = {
	bulk: "shift-position/put-bulk",
};
