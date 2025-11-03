export interface GenerateShiftPdfResponse {
	ok: true;
	filename: string; // ファイル名
	mime: "application/pdf"; // MIMEタイプ（固定）
	encoding: "base64"; // エンコーディング方式
	data: string; // Base64文字列（PDF本体）
}
