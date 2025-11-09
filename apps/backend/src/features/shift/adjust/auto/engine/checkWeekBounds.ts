import type {
	AutoModifiedType,
	AutoShiftSlot,
} from "@shared/api/shift/adjust/types/auto.js";
import type {
	ConstraintsInput,
	CurrentAssignmentsInput,
	SubmissionsInput,
	TemplateShiftInput,
} from "@shared/api/shift/adjust/validations/auto.js";
import type { AssignUserType } from "@shared/api/shift/assign/validations/put.js";
import { shouldUseDate } from "./filters.js";
import { normalizeRange } from "./nomalize.js";

type FinalAssignments = CurrentAssignmentsInput;

function applyAiModified(
	base: CurrentAssignmentsInput,
	ai_modified: AutoModifiedType,
): FinalAssignments {
	// 浅コピーでOK：各日付ごとにマージ
	const merged: CurrentAssignmentsInput = JSON.parse(
		JSON.stringify(base ?? {}),
	);
	for (const [date, ranges] of Object.entries(ai_modified ?? {})) {
		if (!merged[date]) merged[date] = {};
		for (const [range, slot] of Object.entries(ranges ?? {})) {
			const rn = normalizeRange(range);
			if (!rn) continue;
			merged[date][rn] = {
				...(merged[date]?.[rn] ?? {}),
				...slot,
			} as AutoShiftSlot & { assigned: AssignUserType[] };
		}
	}
	return merged;
}

export function checkWeekBounds(params: {
	templateShift: TemplateShiftInput; // 将来のロール等に使う余地
	currentAssignments: CurrentAssignmentsInput; // 元の割当
	ai_modified: AutoModifiedType; // assignerの差分
	submissions: SubmissionsInput[];
	dateFilter?: ConstraintsInput["dateFilter"]; // 同じフィルタを使う
	countScope?: ConstraintsInput["countScope"]; // "WEEK" | "FILTERED"
}) {
	const {
		currentAssignments,
		ai_modified,
		submissions,
		dateFilter,
		countScope = "WEEK",
	} = params;

	// 1) 最終割当を合成
	const finalAssignments = applyAiModified(currentAssignments, ai_modified);

	// 2) 期間に基づきユーザーごとの件数カウント
	const countByUser = new Map<string, number>(); // 期間内のみを数える
	for (const [date, slots] of Object.entries(finalAssignments ?? {})) {
		if (!shouldUseDate(date, dateFilter) && countScope === "FILTER") continue;

		for (const [rangeRaw, slot] of Object.entries(slots ?? {})) {
			const rn = normalizeRange(rangeRaw);
			if (!rn) continue;
			const assigned = (slot as AutoShiftSlot)?.assigned ?? [];
			for (const a of assigned) {
				const uid = a?.uid;
				if (!uid) continue;
				// WEEKの場合は全週合算、FILTEREDは期間内のみ
				if (countScope === "WEEK" || shouldUseDate(date, dateFilter)) {
					countByUser.set(uid, (countByUser.get(uid) ?? 0) + 1);
				}
			}
		}
	}

	// 3) submissionsのMin/Maxと突合
	const unmetMin: Array<{
		userId: string;
		required: number;
		actual: number;
		deficit: number;
	}> = [];
	const exceedMax: Array<{
		userId: string;
		max: number;
		actual: number;
		over: number;
	}> = [];

	for (const sub of submissions ?? []) {
		const uid = sub.userId;
		const actual = countByUser.get(uid) ?? 0;
		const min = sub.weekMin ?? 0;
		const max = sub.weekMax ?? Number.POSITIVE_INFINITY;

		if (actual < min) {
			unmetMin.push({
				userId: uid,
				required: min,
				actual,
				deficit: min - actual,
			});
		}
		if (actual > max) {
			exceedMax.push({ userId: uid, max, actual, over: actual - max });
		}
	}

	return {
		ok: true,
		summary: {
			totalUsers: submissions?.length ?? 0,
			withinBounds:
				(submissions?.length ?? 0) - (unmetMin.length + exceedMax.length),
		},
		unmetMin,
		exceedMax,
	};
}
