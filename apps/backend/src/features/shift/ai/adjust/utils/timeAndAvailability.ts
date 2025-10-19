/**
 * timeAndAvailability.ts
 * --------------------------------------------
 * 役割:
 *  - 時間レンジの重なり判定など「純粋・基本」ユーティリティ群
 *  - 可用性インデックスの構築と可用判定（提出データベース）
 *
 * 特徴:
 *  - 副作用なし（純粋関数）
 *  - 他モジュールから最も頻繁に参照される基盤
 *
 * 注意:
 *  - サーバや外部APIへの依存は禁止（共有ライブラリ想定）
 */

import type { SubmissionsInput } from "@shared/api/shift/ai/validations/post-adjust.js";

/** 2つの時間レンジ "HH:mm-HH:mm" 同士が重なるかを返す */
export function timeOverlap(rangeA: string, rangeB: string): boolean {
	const [aS, aE] = rangeA.split("-");
	const [bS, bE] = rangeB.split("-");
	return !(aE <= bS || bE <= aS);
}

/** submissions から uid→日付→可用レンジ を引けるインデックス(Map)を構築 */
export function buildSubmissionsIndex(submissions: SubmissionsInput[]) {
	const idx = new Map<string, Record<string, string | null | "anytime">>();
	for (const s of submissions) idx.set(s.userId, s.shifts ?? {});
	return idx;
}

/**
 * 提出可用性にもとづき、指定ユーザー(uid)が date の slotRange に入れるか判定
 * @param treatMissingAsUnavailable true の場合、未提出は不可扱い
 */
export function isAvailable(
	index: Map<string, Record<string, string | null | "anytime">>,
	uid: string,
	date: string,
	slotRange: string,
	treatMissingAsUnavailable = true,
): boolean {
	const dayVal = index.get(uid)?.[date];
	if (dayVal === "anytime") return true;
	if (!dayVal) return !treatMissingAsUnavailable;
	return timeOverlap(slotRange, dayVal);
}
