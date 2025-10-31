import type { AiModifiedType } from "@shared/api/shift/ai/types/post-adjust.js";

// utils/dailyUsage.ts
export type DailyUsage = Map<string, Set<string>>; // key: "YYYY-MM-DD" -> Set<uid>

export function buildDailyUsageMap(
	aiModified: AiModifiedType,
	currentAssignments: AiModifiedType,
): DailyUsage {
	const used: DailyUsage = new Map();

	const ingest = (src?: AiModifiedType) => {
		for (const [date, slots] of Object.entries(src ?? {})) {
			let set = used.get(date);
			if (!set) {
				set = new Set();
				used.set(date, set);
			}
			for (const [, block] of Object.entries(slots ?? {})) {
				for (const a of block?.assigned ?? []) set.add(a.uid);
			}
		}
	};

	ingest(currentAssignments);
	ingest(aiModified);
	return used;
}

export function minutes(t: string) {
	const [h, m] = t.split(":").map(Number);
	return h * 60 + m;
}
export function isOverlapping(range1: string, range2: string): boolean {
	const [s1, e1] = range1.split("-").map(minutes);
	const [s2, e2] = range2.split("-").map(minutes);
	return !(e1 <= s2 || e2 <= s1); // 1分でも被ればtrue
}
