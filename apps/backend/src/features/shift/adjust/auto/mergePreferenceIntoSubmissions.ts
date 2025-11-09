import type {
	SubmissionsInput,
	TemplateShiftInput,
} from "@shared/api/shift/adjust/validations/auto.js";
import type { StaffPreferenceDTO } from "@shared/api/staffPreference/dto.js";

const weekday = (dateStr: string) =>
	(["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const)[
		new Date(`${dateStr}T00:00:00Z`).getUTCDay()
	];

export function mergePrefsIntoSubmissions(
	template: TemplateShiftInput,
	submissions: SubmissionsInput[],
	staffPrefs: Pick<
		StaffPreferenceDTO,
		"userId" | "weekMax" | "weekMin" | "weeklyAvailability" | "note"
	>[],
	opts?: { preserveStatus?: boolean },
) {
	const storeId = template.storeId;
	const dates = Object.keys(template.requests).sort(); // YYYY-MM-DD keys
	// submissionsが空でもstaffPrefs全員分の提出データを必ず生成
	const subByUser = new Map<string, SubmissionsInput>();
	// まずstaffPrefs全員分の空提出を初期化
	for (const pref of staffPrefs) {
		subByUser.set(pref.userId, {
			id: `${pref.userId}`,
			shiftRequestId: template.id,
			storeId,
			weekMax: pref.weekMax ?? 1,
			weekMin: pref.weekMin ?? 1,
			createdAt: new Date(),
			updatedAt: new Date(),
			userId: pref.userId,
			status: "ADJUSTMENT",
			memo: "",
			shifts: {},
		});
	}
	// 既存submissionsで上書き
	submissions.map((s) => subByUser.set(s.userId, s));

	// 元の提出かどうかのマーク（confirmed再計算用に返す）
	const origin: Record<string, Record<string, "user" | "pref">> = {};

	for (const pref of staffPrefs) {
		// そのユーザの既存提出（なければ作成）
		let sub = subByUser.get(pref.userId);
		if (!sub) {
			sub = {
				id: `${pref.userId}`,
				shiftRequestId: template.id,
				storeId,
				weekMax: pref.weekMax ?? 1,
				weekMin: pref.weekMin ?? 1,
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: pref.userId,
				status: "ADJUSTMENT",
				memo: "",
				shifts: {},
			};
			subByUser.set(pref.userId, sub);
		}

		origin[pref.userId] ||= {};

		for (const d of dates) {
			// 既に「提出がある」 → 触らない（null は休み指定だから最優先で保持）
			if (d in (sub.shifts || {})) continue;

			const wd = weekday(d) as keyof typeof pref.weeklyAvailability;
			const spec = pref.weeklyAvailability[wd];
			if (!spec) continue; // 希望なし→埋めない
			sub.shifts[d] = spec; // 希望で補完（提出がない“日だけ”）
			origin[pref.userId][d] = "pref"; // 由来マーク
		}

		if (!opts?.preserveStatus) {
			// ここでは status は変えない（既存提出を壊さない）
			// 何もしない
		}
	}

	// 出力：提出（ユーザ提出＋希望補完済み）と、由来マップ（AIのconfirmed無視/再計算用）
	return {
		mergedSubmissions: Array.from(subByUser.values()),
		originMap: origin,
	};
}
