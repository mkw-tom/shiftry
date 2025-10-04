import { get } from "node:http";

export const assignShiftApi = {
	base: (id?: string) => `shift/assign/${id}`,
	get: (shiftRequestId: string) => `shift/assign/${shiftRequestId}`,
	put: "shift/assign",
};

export const shiftReqeustApi = {
	base: "shift/request",
	get: (shiftRequestId: string) => `shift/request/${shiftRequestId}`,
	put: "shift/request",
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

export const lineMessageApi = {
	confirmedShift: "webhook/line/confirmed-shift",
	requestShift: "webhook/line/request-shift",
	event: "webhook/line/event",
};

export const shiftNotificationApi = {
	confirm: "notification/confirm",
};
