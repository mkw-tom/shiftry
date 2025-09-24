// utils/buildRequests.ts
import { displayHHmm } from "@/app/utils/times";
import type { UpsertShiftRequetInput } from "@shared/api/shift/request/validations/put";
import type { bulkUpsertShiftPositionInput } from "@shared/api/shiftPosition/validations/put-bulk";
import { formatDateToYYYYMMDD } from "@shared/utils/formatDate";
import { convertDateToWeekByEnglish } from "@shared/utils/formatWeek";

import type {
	DateType,
	RequestPositionType,
	RequestsType,
} from "@shared/api/shift/request/validations/put";

export function buildRequestsFromPositions(
	prev: UpsertShiftRequetInput,
	shiftPositions: bulkUpsertShiftPositionInput,
): UpsertShiftRequetInput["requests"] {
	const existing = prev.requests ?? {};
	if (!prev.weekStart || !prev.weekEnd) return existing;

	// 週の全日リスト（昇順）
	const start = new Date(prev.weekStart);
	const end = new Date(prev.weekEnd);
	const days: Date[] = [];
	for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		days.push(new Date(d));
	}
	// positions → 日付×時刻スロット（生成分）
	const generated: RequestsType = {};
	for (const date of days) {
		const dateKey = formatDateToYYYYMMDD(date);
		const dateMap: DateType | null = {};
		for (const pos of shiftPositions) {
			const weekKey = convertDateToWeekByEnglish(date);
			if (!pos.weeks.includes(weekKey)) continue;

			const startTime = displayHHmm(pos.startTime); // "HH:mm"
			const endTime = displayHHmm(pos.endTime); // "HH:mm"
			const timeKey = `${startTime}-${endTime}`;

			const slotFromPosition: RequestPositionType = {
				name: pos.name,
				count: pos.count ?? 1,
				jobRoles: pos.jobRoles ?? [],
				absolute:
					pos.absolute?.map((s) => ({
						id: s.id,
						name: s.name,
						pictureUrl: s.pictureUrl,
					})) ?? [],
				priority:
					pos.priority?.map((s) => ({
						id: s.id,
						name: s.name,
						pictureUrl: s.pictureUrl,
						level: 1,
					})) ?? [],
			};

			if (dateMap !== null) dateMap[timeKey] = slotFromPosition;
		}
		// 生成スロットがなければnull
		generated[dateKey] =
			dateMap && Object.keys(dateMap).length > 0 ? dateMap : null;
	}

	// 最終出力（全日付のキーを必ず作る）
	const out: UpsertShiftRequetInput["requests"] = {};

	for (const date of days) {
		const dateKey = formatDateToYYYYMMDD(date);
		const ex = existing[dateKey]; // 既存（undefined | null | map）
		const gen = generated[dateKey] ?? {}; // 生成（map or {}）

		if (ex === null) {
			// 既存で null 指定ならそのまま（定休日など）
			out[dateKey] = null;
			continue;
		}

		// 既存のキー（時間帯）をすべて取得
		const exKeys = ex ? Object.keys(ex) : [];
		const genKeys = gen ? Object.keys(gen) : [];
		const allKeys = Array.from(new Set([...genKeys, ...exKeys]));

		// 型安全なマージ（RequestPositionTypeのみ）
		const mergedMap: DateType | null = {};
		for (const key of allKeys) {
			if (ex && ex[key] !== undefined) {
				mergedMap[key] = ex[key] as RequestPositionType;
			} else if (gen && gen[key] !== undefined) {
				mergedMap[key] = gen[key] as RequestPositionType;
			}
		}
		// スロット0件 → null にする（＝空日もキーは出す）
		out[dateKey] =
			mergedMap && Object.keys(mergedMap).length > 0 ? mergedMap : null;
	}

	return out;
}
