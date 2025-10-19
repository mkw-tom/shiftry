import type { AssignStatusType } from "../../../../api/shift/assign/validations/put.js";
import type { AIAssignedUserType } from "../validations/post-adjust.js";

export type AIShiftAdjustResponse = {
	ok: true;
	ai_modified: AiModifiedType;
	meta?: AIMetaInfo;
};

export type AIShiftSlot = {
	name: string;
	count: number;
	jobRoles: string[];
	assigned: AIAssignedUserType[];
	assignedCount: number;
	vacancies: number;
	status: AssignStatusType;
	updatedAt: string;
	updatedBy: string;
};

export type AiModifiedType = Record<string, Record<string, AIShiftSlot>>;

export interface AIMetaInfo {
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
