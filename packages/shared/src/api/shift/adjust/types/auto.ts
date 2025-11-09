import type { AssignStatusType } from "../../assign/validations/put.js";
import type { AutoAssignedUserType } from "../validations/auto.js";

export type AutoShiftAdjustResponse = {
	ok: true;
	auto_modified: AutoModifiedType;
	meta?: AutoMetaInfo;
};

export type AutoShiftSlot = {
	name: string;
	count: number;
	jobRoles: string[];
	assigned: AutoAssignedUserType[];
	assignedCount: number;
	vacancies: number;
	status: AssignStatusType;
	updatedAt: string;
	updatedBy: string;
};

export type AutoModifiedType = Record<string, Record<string, AutoShiftSlot>>;

export interface AutoMetaInfo {
	model: string;
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
	responseId?: string;
	durationMs?: number;
	executedAt: string;
	costUsd?: number;
	env?: "development" | "staging" | "production";
}
