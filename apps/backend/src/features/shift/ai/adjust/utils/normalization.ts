/**
 * normalization.ts
 * --------------------------------------------
 * 役割:
 *  - assigned 配列の正規化（型/重複/空文字補正）
 *  - 枠(block)の count/assignedCount/vacancies 整合性維持
 *  - ai_modified 全体の最終整形
 *
 * ポリシー:
 *  - 不足値は安全側(空文字/false)で補完
 *  - 配列重複は「最初勝ち」
 */

import type {
	AIShiftSlot,
	AiModifiedType,
} from "@shared/api/shift/ai/types/post-adjust.js";

/** assignedエントリを {uid, displayName, pictureUrl, confirmed} へ正規化＋重複排除 */
// biome-ignore lint/suspicious/noExplicitAny: AI出力の型補正のためany許容
export function normalizeAssignedList(arr: any[]) {
	const list = Array.isArray(arr) ? arr : [];

	// biome-ignore lint/suspicious/noExplicitAny: AI出力の型補正のためany許容
	const normalized = list.map((a: any) => {
		const uid = String(a?.uid ?? "").trim();
		const displayName =
			typeof a?.displayName === "string" && a.displayName.trim().length > 0
				? a.displayName
				: uid;
		const pictureUrl = typeof a?.pictureUrl === "string" ? a.pictureUrl : "";
		const confirmed = Boolean(a?.confirmed);
		return { uid, displayName, pictureUrl, confirmed };
	});

	const seen = new Set<string>();
	return normalized.filter((a) => {
		if (!a?.uid || seen.has(a.uid)) return false;
		seen.add(a.uid);
		return true;
	});
}

/** countに収まるよう assigned を切り詰め、assignedCount/vacancies を再計算 */
export function applyCountIntegrity(block: AIShiftSlot) {
	const count = Math.max(0, Number(block?.count));
	block.count = count;
	block.assigned = block.assigned.slice(0, count);
	block.assignedCount = block.assigned.length;
	block.vacancies = Math.max(0, count - block.assignedCount);
	if (!["proposed", "draft", "confirmed"].includes(block.status)) {
		block.status = "proposed";
	}
}

/** ai_modified 全体に対して normalizeAssignedList + applyCountIntegrity を適用 */
export function normalizeAiModified(aiModified: AiModifiedType) {
	for (const [, slots] of Object.entries(aiModified)) {
		for (const [, block] of Object.entries(slots)) {
			block.assigned = normalizeAssignedList(block.assigned);
			applyCountIntegrity(block);
		}
	}
	return aiModified;
}
