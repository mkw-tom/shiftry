import type {
	ConstraintsInput,
	CurrentAssignmentsInput,
	SubmissionsInput,
	TemplateShiftInput,
} from "@shared/api/shift/adjust/validations/auto.js";
import { shouldUseDate } from "./filters.js";
import {
	type buildAbsPri,
	type buildProfilesIndex,
	type buildSubmissionsIndex,
	containsFully,
	normalizeRange,
	overlapRange,
} from "./nomalize.js";

export function isAvailable(
	subIdx: ReturnType<typeof buildSubmissionsIndex>,
	uid: string,
	date: string,
	slotRangeRaw: string,
	allowPartial: boolean,
) {
	const slotRange = normalizeRange(slotRangeRaw);
	if (!slotRange) return false;

	const v = subIdx.byDate.get(date)?.get(uid);
	if (!v) return false;
	if (v === "anytime") return true;
	if (typeof v === "string") {
		return allowPartial
			? overlapRange(v, slotRange)
			: containsFully(v, slotRange);
	}
	return false;
}

export function hasRole(
	rolesIdx: ReturnType<typeof buildProfilesIndex>["roles"],
	uid: string,
	jobRoles?: string[],
	isAbsolute?: boolean,
) {
	if (isAbsolute) return true; // absoluteはバイパス
	if (!jobRoles || jobRoles.length === 0) return true; // 枠ロール未指定なら通す
	const r = rolesIdx.get(uid);
	if (!r || r.size === 0) return true; // ユーザーロール未設定は通す（初期導入緩和）
	return jobRoles.some((need) => r.has(need));
}

/* =========================
 * 集計トラッキング
 * ========================= */
export function bump<T>(map: Map<T, number>, key: T, delta = 1) {
	map.set(key, (map.get(key) ?? 0) + delta);
}

export function assignCountWeekInit(subs: SubmissionsInput[]) {
	const min = new Map<string, number>();
	const max = new Map<string, number>();
	const cur = new Map<string, number>();
	for (const s of subs) {
		min.set(s.userId, s.weekMin ?? 0);
		max.set(s.userId, s.weekMax ?? Number.POSITIVE_INFINITY);
		cur.set(s.userId, 0);
	}
	return { min, max, cur };
}

/* =========================
 * フェアネス用の下準備
 *  - ユーザーごとの「入れる候補枠の総数（スカース性）」を週全体で数える
 * ========================= */
export function precomputeEligibleCounts(params: {
	templateShift: TemplateShiftInput;
	submissionsIdx: ReturnType<typeof buildSubmissionsIndex>;
	profilesIdx: ReturnType<typeof buildProfilesIndex>;
	abs: ReturnType<typeof buildAbsPri>["abs"];
	pri: ReturnType<typeof buildAbsPri>["pri"];
	allowPartial: boolean;
	dateFilter: ConstraintsInput["dateFilter"]; // ← 追加
}) {
	const { templateShift, submissionsIdx, abs, pri, allowPartial, dateFilter } =
		params;
	const eligibleCount = new Map<string, number>();

	for (const [date, slots] of Object.entries(templateShift.requests ?? {})) {
		if (!slots) continue;
		if (!shouldUseDate(date, dateFilter)) continue; // ← 期間外スキップ

		for (const [rangeRaw, def] of Object.entries(slots)) {
			const range = normalizeRange(rangeRaw);
			if (!range) continue;

			const absSet = abs.get(date)?.get(range) ?? new Set<string>();
			const priMap = pri.get(date)?.get(range) ?? new Map<string, number>();

			const candidateUids = new Set<string>();
			for (const [uid] of submissionsIdx.byUser) candidateUids.add(uid);
			for (const uid of absSet) candidateUids.add(uid);
			for (const uid of priMap.keys()) candidateUids.add(uid);

			for (const uid of candidateUids) {
				if (
					!params.submissionsIdx // reuse isAvailable from this file // TS抑止のために一旦展開
				) {
				}
				// 直接呼ぶ
				if (!isAvailable(submissionsIdx, uid, date, range, allowPartial))
					continue;
				// ロールは現状オフの方針なので省略（必要なら hasRole を再適用）
				bump(eligibleCount, uid, 1);
			}
		}
	}

	return eligibleCount;
}

/* =========================
 * 候補整列
 * ========================= */
export function sortCandidates(
	uids: string[],
	uidToScore: (uid: string) => { tier: number; tie?: number[] },
) {
	return uids.sort((a, b) => {
		const A = uidToScore(a);
		const B = uidToScore(b);
		if (A.tier !== B.tier) return A.tier - B.tier;
		const tA = A.tie ?? [];
		const tB = B.tie ?? [];
		const n = Math.max(tA.length, tB.length);
		for (let i = 0; i < n; i++) {
			const av = tA[i] ?? 0;
			const bv = tB[i] ?? 0;
			if (av !== bv) return av - bv;
		}
		return a < b ? -1 : a > b ? 1 : 0;
	});
}

/* =========================
 * currentAssignments のキー解決
 * ========================= */
export function getCurrentSlot(
	day: CurrentAssignmentsInput[string] | undefined,
	rangeNorm: string,
	rangeRaw: string,
) {
	if (!day) return undefined;
	if (day[rangeNorm]) return day[rangeNorm];
	if (day[rangeRaw]) return day[rangeRaw];
	for (const [k, v] of Object.entries(day)) {
		const kn = normalizeRange(k);
		if (kn && kn === rangeNorm) return v;
	}
	return undefined;
}
