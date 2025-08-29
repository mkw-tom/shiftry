// utils/buildRequests.ts
import { displayHHmm } from "@/app/ utils/times";
import type { UpsertShiftRequetInput } from "@shared/api/shift/request/validations/put";
import type { bulkUpsertShiftPositionInput } from "@shared/api/shiftPosition/validations/put-bulk";
import { formatDateToYYYYMMDD } from "@shared/utils/formatDate";
import { convertDateToWeekByEnglish } from "@shared/utils/formatWeek";

/**
 * 週範囲と shiftPositions から requests を生成し、既存 requests を尊重してマージする
 * - 生成したスロットと既存スロットが衝突したら「既存を優先」して上書き
 * - 既存にしかないフィールドも保持（既存をスプレッドで後に置く）
 */
export function buildRequestsFromPositions(
	prev: UpsertShiftRequetInput,
	shiftPositions: bulkUpsertShiftPositionInput,
): UpsertShiftRequetInput["requests"] {
	const generated: UpsertShiftRequetInput["requests"] = {};
	const existing = prev.requests ?? {};

	if (!prev.weekStart || !prev.weekEnd) return existing;

	// 週の全日を列挙
	const start = new Date(prev.weekStart);
	const end = new Date(prev.weekEnd);
	const days: Date[] = [];
	for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		days.push(new Date(d));
	}

	// shiftPositions を日付×時刻スロットに展開
	for (const date of days) {
		const dateKey = formatDateToYYYYMMDD(date); // "YYYY-MM-DD"
		for (const pos of shiftPositions) {
			const weekKey = convertDateToWeekByEnglish(date); // "monday" など
			if (!pos.weeks.includes(weekKey)) continue;

			const startTime = displayHHmm(pos.startTime); // -> "HH:mm"
			const endTime = displayHHmm(pos.endTime); // -> "HH:mm"
			const timeKey = `${startTime}-${endTime}`;

			const slotFromPosition = {
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

			if (!generated[dateKey]) generated[dateKey] = {};
			generated[dateKey][timeKey] = slotFromPosition;
		}
	}

	// 既存とマージ（既存優先・既存の余剰プロパティも保持）
	const merged: UpsertShiftRequetInput["requests"] = { ...existing };

	for (const [dateKey, slots] of Object.entries(generated)) {
		merged[dateKey] = {
			...(existing[dateKey] ?? {}),
			// 同じ timeKey がある場合は { ...generatedSlot, ...existingSlot } で既存優先・余剰保持
			...Object.fromEntries(
				Object.entries(slots ?? {}).map(([timeKey, genSlot]) => {
					const oldSlot = existing[dateKey]?.[timeKey];
					return [timeKey, oldSlot ? { ...genSlot, ...oldSlot } : genSlot];
				}),
			),
		};
	}

	return merged;
}
