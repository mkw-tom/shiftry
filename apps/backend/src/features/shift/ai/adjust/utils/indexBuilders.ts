/**
 * indexBuilders.ts
 * --------------------------------------------
 * 役割:
 *  - 参照しやすくするためのインデックス化ロジック
 *    - 既存アサインを「ロック集合」と「ステータスマップ」に
 *    - 雛形(absolute/priority)を日付・時間帯ごとの優先度テーブルに
 *
 * 用途:
 *  - マージ/サニタイズ/充足アルゴリズムから参照される中間構造を提供
 */

import type {
	CurrentAssignmentsInput,
	TemplateShiftInput,
} from "@shared/api/shift/ai/validations/post-adjust.js";

/**
 * 既存アサインのロック集合と、スロット単位の status を取り出す
 * @returns locked: `${date}::${range}::${uid}` のSet, statusMap: `${date}::${range}`→status
 */
export function buildLockedSetAndStatus(
	currentAssignments: CurrentAssignmentsInput,
) {
	const locked = new Set<string>(); // key: `${date}::${range}::${uid}`
	const statusMap = new Map<string, string>(); // key: `${date}::${range}`

	for (const [date, slots] of Object.entries(currentAssignments ?? {})) {
		for (const [range, block] of Object.entries(slots ?? {})) {
			const keySlot = `${date}::${range}`;
			if (block?.status) statusMap.set(keySlot, block.status);
			for (const a of block?.assigned ?? []) {
				if (a?.uid) locked.add(`${date}::${range}::${a.uid}`);
			}
		}
	}
	return { locked, statusMap };
}

/**
 * 雛形から absolute(必入) と priority(level) を取り出し、日付/レンジ単位に集約
 * @returns index: date→range→{abs:Set, pri:Map(uid→level)}, nameIndex: uid→displayName
 */
export function buildHintIndex(templateShift: TemplateShiftInput) {
	const index = new Map<
		string,
		Map<string, { abs: Set<string>; pri: Map<string, number> }>
	>();
	const nameIndex = new Map<string, string>(); // uid -> displayName

	const reqs = templateShift?.requests ?? {};
	for (const [date, slots] of Object.entries(reqs)) {
		const slotMap = new Map<
			string,
			{ abs: Set<string>; pri: Map<string, number> }
		>();
		for (const [range, def] of Object.entries(slots ?? {})) {
			const absSet = new Set<string>();
			for (const u of def?.absolute ?? []) {
				if (u?.id) {
					absSet.add(u.id);
					if (u?.name) nameIndex.set(u.id, u.name);
				}
			}
			const priMap = new Map<string, number>();
			for (const u of def?.priority ?? []) {
				if (u?.id) {
					priMap.set(u.id, Number(u.level ?? 999));
					if (u?.name) nameIndex.set(u.id, u.name);
				}
			}
			slotMap.set(range, { abs: absSet, pri: priMap });
		}
		index.set(date, slotMap);
	}
	return { index, nameIndex };
}
