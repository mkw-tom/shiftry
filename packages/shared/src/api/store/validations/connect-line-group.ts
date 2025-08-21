// @shared/api/store/validations/store-code.ts
import { z } from "zod";

/** 3 グループ × 各 4 桁（英大文字 or 数字） */
export const STORE_CODE_REGEX = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

/** 入力を正規化（全角→半角、dash統一、英大文字化、不要文字除去、ハイフン自動挿入など） */
export function canonicalizeStoreCode(input: string): string {
	let s = (input ?? "").toString();

	// 全角 → 半角（NFKC）
	s = s.normalize("NFKC");

	// 似たダッシュをハイフンに統一
	s = s.replace(/[–—－﹣]/g, "-");

	// 英大文字化
	s = s.toUpperCase();

	// 英数とハイフン以外を除去（スペース等も除去）
	s = s.replace(/[^A-Z0-9-]/g, "");

	// ハイフンが無い場合、長さ 12 なら 4-4-4 に挿入
	if (!s.includes("-")) {
		const only = s.replace(/-/g, "");
		if (only.length === 12) {
			s = `${only.slice(0, 4)}-${only.slice(4, 8)}-${only.slice(8, 12)}`;
		}
	}

	return s;
}

/**
 * 入力ゆるめ → 正規化 → 厳格チェック
 * parse すると正規化済みの `XXXX-XXXX-XXXX` を返す
 */
export const StoreCodeValidate = z
	.string()
	.transform((v) => canonicalizeStoreCode(v))
	.refine((v) => STORE_CODE_REGEX.test(v), {
		message: "店舗コードの形式が不正です（例: XXXX-XXXX-XXXX）",
	});

/** リクエストBody用（例: { storeCode: "xxxx-..." }） */
export const StoreCodeFormValidate = z.object({
	storeCode: StoreCodeValidate,
});

/** ヘッダー取り回し用（例: x-store-code）をまとめて検証したい時 */
export const StoreCodeHeaderValidate = z.object({
	"x-store-code": StoreCodeValidate,
});
