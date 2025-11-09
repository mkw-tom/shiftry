import type {
	AutoModifiedType,
	AutoShiftAdjustResponse,
} from "@shared/api/shift/adjust/types/auto.js";
// assigner.ts
import type {
	ConstraintsInput,
	CurrentAssignmentsInput,
	MemberProfileInput,
	SubmissionsInput,
	TemplateShiftInput,
	// ...省略
} from "@shared/api/shift/adjust/validations/auto.js";
import { shouldUseDate } from "./filters.js";
import {
	buildAbsPri,
	buildProfilesIndex,
	buildSubmissionsIndex,
	normalizeRange,
	overlapRange,
} from "./nomalize.js";
import {
	assignCountWeekInit,
	bump,
	getCurrentSlot,
	isAvailable,
	precomputeEligibleCounts,
	sortCandidates,
} from "./rules.js";

export function assignShiftsDeterministic(params: {
	templateShift: TemplateShiftInput;
	submissions: SubmissionsInput[];
	currentAssignments: CurrentAssignmentsInput;
	memberProfiles: MemberProfileInput[];
	constraints?: ConstraintsInput;
}): AutoShiftAdjustResponse {
	const {
		templateShift,
		submissions,
		currentAssignments,
		memberProfiles,
		constraints,
	} = params;

	const subIdx = buildSubmissionsIndex(submissions);
	const profIdx = buildProfilesIndex(memberProfiles);
	const { abs, pri } = buildAbsPri(templateShift);

	const week = assignCountWeekInit(submissions);
	const dailyCount = new Map<string, Map<string, number>>();
	const perDayAssignedRanges = new Map<string, Map<string, string[]>>();
	const seenThisWeek = new Map<string, number>();

	const auto_modified: AutoModifiedType = {};
	const allowPartial = !!constraints?.allowPartialOverlap;
	const dailyMax = constraints?.dailyMaxPerUser ?? 1;
	const maximizeDistinct = constraints?.maximizeDistinctAssignments ?? true;

	// ★ 追加
	const dateFilter = constraints?.dateFilter ?? { mode: "ALL" };
	const countScope = "WEEK";

	const eligibleCount = maximizeDistinct
		? precomputeEligibleCounts({
				templateShift,
				submissionsIdx: subIdx,
				profilesIdx: profIdx,
				abs,
				pri,
				allowPartial,
				dateFilter, // ← 期間適用
			})
		: new Map<string, number>();

	for (const [date, slots] of Object.entries(templateShift.requests ?? {})) {
		if (!slots) continue;
		if (!shouldUseDate(date, dateFilter)) continue; // ← 期間外スキップ

		const curDay = currentAssignments[date] ?? {};

		for (const [rangeRaw, def] of Object.entries(slots ?? {})) {
			const rangeNorm = normalizeRange(rangeRaw);
			if (!rangeNorm) continue;

			const cur = getCurrentSlot(curDay, rangeNorm, rangeRaw);
			const curAssigned = (cur?.assigned ?? []).map(
				(a: { uid: string }) => a.uid,
			);

			const need = def.count ?? 0;

			// 既存割当をカウント反映
			for (const uid of curAssigned) {
				// 週カウントは scope に応じて反映
				if (countScope === "WEEK" || shouldUseDate(date, dateFilter)) {
					bump(week.cur, uid, 1);
					bump(seenThisWeek, uid, 1);
				}
				if (!dailyCount.has(date)) dailyCount.set(date, new Map());
				bump(dailyCount.get(date) as Map<string, number>, uid, 1);

				if (!perDayAssignedRanges.has(date))
					perDayAssignedRanges.set(date, new Map());
				const arr = perDayAssignedRanges.get(date)?.get(uid) ?? [];
				arr.push(rangeNorm);
				perDayAssignedRanges.get(date)?.set(uid, arr);
			}

			const assigned = [...(cur?.assigned ?? [])];

			const remain = Math.max(0, need - assigned.length);
			if (remain > 0) {
				const absSet = abs.get(date)?.get(rangeNorm) ?? new Set<string>();
				const priMap =
					pri.get(date)?.get(rangeNorm) ?? new Map<string, number>();

				const candidateUids = new Set<string>(memberProfiles.map((p) => p.uid));
				for (const uid of absSet) candidateUids.add(uid);
				for (const uid of priMap.keys()) candidateUids.add(uid);

				const candidates = [...candidateUids].filter((uid) => {
					if (assigned.some((a) => a.uid === uid)) return false;
					if (!isAvailable(subIdx, uid, date, rangeNorm, allowPartial))
						return false;

					// 週max（scopeに関わらず週ベースMaxを使う運用が無難）
					if (
						(week.cur.get(uid) ?? 0) >=
						(week.max.get(uid) ?? Number.POSITIVE_INFINITY)
					)
						return false;

					// 日max
					const dcnt = dailyCount.get(date)?.get(uid) ?? 0;
					if (dailyMax != null && dcnt >= dailyMax) return false;

					// 当日重複
					const exist = perDayAssignedRanges.get(date)?.get(uid) ?? [];
					if (exist.some((r) => overlapRange(r, rangeNorm))) return false;

					return true;
				});

				sortCandidates(candidates, (uid) => {
					const tier = absSet.has(uid) ? 0 : priMap.has(uid) ? 1 : 2;

					const wCur = week.cur.get(uid) ?? 0;
					const wMin = week.min.get(uid) ?? 0;
					const underMin = Math.max(0, wMin - wCur);
					const dayCur = dailyCount.get(date)?.get(uid) ?? 0;
					const weekSeen = seenThisWeek.get(uid) ?? 0;
					const scarce = eligibleCount.has(uid)
						? (eligibleCount.get(uid) ?? 0)
						: Number.MAX_SAFE_INTEGER;

					const tie = maximizeDistinct
						? [weekSeen, -underMin, scarce, wCur, dayCur]
						: [-underMin, wCur, dayCur];

					return { tier, tie };
				});

				for (const uid of candidates) {
					if (assigned.length >= need) break;

					const dcnt = dailyCount.get(date)?.get(uid) ?? 0;
					if (dailyMax != null && dcnt >= dailyMax) continue;
					const exist = perDayAssignedRanges.get(date)?.get(uid) ?? [];
					if (exist.some((r) => overlapRange(r, rangeNorm))) continue;

					const source = absSet.has(uid)
						? ("absolute" as const)
						: priMap.has(uid)
							? ("priority" as const)
							: ("auto" as const);

					assigned.push({
						uid,
						displayName: profIdx.name.get(uid) ?? uid,
						pictureUrl: profIdx.pic.get(uid),
						confirmed: true,
						source,
					});

					// 付与カウント
					if (countScope === "WEEK" || shouldUseDate(date, dateFilter)) {
						bump(week.cur, uid, 1);
						bump(seenThisWeek, uid, 1);
					}
					if (!dailyCount.has(date)) dailyCount.set(date, new Map());
					bump(dailyCount.get(date) as Map<string, number>, uid, 1);
					if (!perDayAssignedRanges.has(date))
						perDayAssignedRanges.set(date, new Map());
					const arr = perDayAssignedRanges.get(date)?.get(uid) ?? [];
					arr.push(rangeNorm);
					perDayAssignedRanges.get(date)?.set(uid, arr);
				}
			}

			const assignedCount = assigned.length;
			const vacancies = Math.max(0, (def.count ?? 0) - assignedCount);

			const curSnap = JSON.stringify({
				name: cur?.name ?? def.name,
				count: cur?.count ?? def.count,
				jobRoles: cur?.jobRoles ?? def.jobRoles ?? [],
				assigned: cur?.assigned ?? [],
				status: cur?.status ?? "draft",
			});
			const nextSnap = JSON.stringify({
				name: def.name,
				count: def.count,
				jobRoles: def.jobRoles ?? [],
				assigned,
				status: (cur?.status ?? "draft") as "draft" | "proposed" | "confirmed",
			});

			if (curSnap !== nextSnap) {
				if (!auto_modified[date]) auto_modified[date] = {};
				auto_modified[date][rangeNorm] = {
					name: def.name,
					count: def.count,
					jobRoles: def.jobRoles ?? [],
					assigned,
					assignedCount,
					vacancies,
					status: cur?.status ?? "draft",
					updatedAt: cur?.updatedAt ?? new Date().toISOString(),
					updatedBy: cur?.updatedBy ?? "system",
				};
			}
		}
	}

	return { ok: true, auto_modified };
}
