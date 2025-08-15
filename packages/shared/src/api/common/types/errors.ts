import type { ZodIssue } from "zod";

export type ErrorCode =
	| "BAD_REQUEST" // リクエスト不備（バリデーション含む）
	| "UNAUTHORIZED" // 認証なし/無効
	| "FORBIDDEN" // 認可NG（権限/所属）
	| "NOT_FOUND" // 対象なし
	| "CONFLICT" // 競合（重複登録など）
	| "RATE_LIMITED" // レート制限
	| "SERVER_ERROR" // サーバ内部
	| "UNKNOWN";

export type ErrorResponse = {
	ok: false;
	// code: ErrorCode
	message: string;
};

export type ValidationErrorResponse = {
	ok: false;
	message: string;
	errors: ZodIssue[];
};
