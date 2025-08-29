// date-io.ts などに
const pad = (n: number) => String(n).padStart(2, "0");

// Date(ローカル日付) -> "YYYY-MM-DDT00:00:00.000Z"（UTCの0時）
export const toISODateUTC = (d?: Date | null): string =>
	d
		? new Date(
				Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),
			).toISOString()
		: "";

/**
 * "YYYY-MM-DDT00:00:00.000Z" -> Date(ローカル日付)
 * 表示用に「同じカレンダー日」をローカルタイムで作る
 */
export const isoUTCToLocalDate = (iso?: string): Date | undefined => {
	if (!iso) return undefined;
	const ymd = iso.slice(0, 10); // "YYYY-MM-DD"
	const [y, m, d] = ymd.split("-").map(Number);
	const dt = new Date(y, m - 1, d);
	dt.setHours(0, 0, 0, 0);
	return dt;
};
