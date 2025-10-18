/**
 * AIシフト調整APIのレスポンス型
 * --------------------------------------------
 * 各日付ごとに時間帯スロットがあり、
 * それぞれにシフト情報・割当メンバーが格納される。
 */
export type AIShiftAdjustResponse = {
	ok: true;
	ai_modified: AiModifiedType;
	meta?: AIMetaInfo;
};

export type AIShiftSlot = {
	name: string;
	count: number;
	jobRoles: string[];
	assigned: AIAssignedUser[];
	assignedCount: number;
	vacancies: number;
	status: "proposed" | "draft" | "confirmed";
	updatedAt: string;
	updatedBy: string;
};

export type AIAssignedUser = {
	uid: string;
	displayName: string;
	pictureUrl: string;
	confirmed: boolean;
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
