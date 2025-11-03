// apps/backend/src/features/pdf/mapper.ts
import type { RawShiftJsonInput } from "@shared/api/pdf/validations/shift.js";

export type ShiftRow = {
	date: string; // 2025-11-10
	weekday: string; // (月)
	timeRange: string; // 06:30-08:30
	positionName: string; // 朝レジ
	staffNames: string; // "テスト3, テスト4"
	assignedCount: number; // 2
	vacancies: number; // 0
	isFirstOfDate: boolean; // 同日内で最初の行か
};

export function mapRawToRows(raw: RawShiftJsonInput): ShiftRow[] {
	const rows: ShiftRow[] = [];
	const wd = ["日", "月", "火", "水", "木", "金", "土"];
	const sortByDate = Object.keys(raw).sort();

	for (const date of sortByDate) {
		const slots = raw[date];
		const timeRanges = Object.keys(slots).sort();
		const weekday = wd[new Date(`${date}T00:00:00`).getDay()];

		timeRanges.forEach((tr, idx) => {
			const s = slots[tr];
			if (!s) return;
			const staffNames = s.assigned?.map((a) => a.displayName).join(", ") || "";
			rows.push({
				date,
				weekday: `(${weekday})`,
				timeRange: tr,
				positionName: s.name,
				staffNames,
				assignedCount: s.assignedCount ?? 0,
				vacancies: s.vacancies ?? 0,
				isFirstOfDate: idx === 0, // ← 1日目のみtrue
			});
		});
	}

	return rows;
}
