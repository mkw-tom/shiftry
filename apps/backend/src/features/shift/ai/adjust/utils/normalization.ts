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
import type {
	AIAssignedUserType,
	SourceType,
} from "@shared/api/shift/ai/validations/post-adjust.js";

function normalizeSource(
	src: string,
): "absolute" | "priority" | "auto" | "manual" {
	if (
		src === "absolute" ||
		src === "priority" ||
		src === "manual" ||
		src === "auto"
	)
		return src;
	// 空文字や未定義などは "auto" に寄せる
	return "auto";
}

export function normalizeAssignedList(arr: AIAssignedUserType[]) {
	const normalized = arr.map((a) => {
		const uid = String(a?.uid ?? "").trim();
		const displayName = a.displayName;
		const pictureUrl = a.pictureUrl ?? null;
		const confirmed = Boolean(a?.confirmed);
		const source = normalizeSource(a?.source);
		return { uid, displayName, pictureUrl, confirmed, source };
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
