export type AbsDTO = { id: string; name: string; pictureUrl?: string };
export type PriDTO = {
	id: string;
	name: string;
	pictureUrl?: string;
	level: number;
};
export type WeekDay =
	| "monday"
	| "tuesday"
	| "wednesday"
	| "thursday"
	| "friday"
	| "saturday"
	| "sunday";

export type ShiftPositionDTO = {
	id: string;
	name: string;
	startTime: Date; // ISO
	endTime: Date; // ISO
	count: number | null;
	weeks: WeekDay[];
	jobRoles: string[];
	absolute: AbsDTO[];
	priority: PriDTO[];
};
