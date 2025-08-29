export const isHHmm = (v?: string) => !!v && /^\d{2}:\d{2}$/.test(v);

export const toHHmm = (d: Date | null) => {
	if (!d) return "";
	const h = String(d.getHours()).padStart(2, "0");
	const m = String(d.getMinutes()).padStart(2, "0");
	return `${h}:${m}`;
};

export const fromHHmm = (hhmm?: string) => {
	if (!hhmm) return null;
	const [h, m] = hhmm.split(":").map((x) => Number.parseInt(x, 10));
	if (Number.isNaN(h) || Number.isNaN(m)) return null;
	const d = new Date();
	d.setHours(h, m, 0, 0);
	return d;
};

export const formatTimeRangeHHmm = (range: string) => {
	if (!range) return "";
	const [rawS, rawE] = range.split("-");
	const s = rawS?.trim();
	const e = rawE?.trim();
	if (!isHHmm(s) || !isHHmm(e)) return range; // 想定外フォーマットならそのまま表示
	return `${s} ~ ${e}`;
};
export const displayHHmm = (v?: string) => {
	if (!v) return "";
	if (isHHmm(v)) return v; // "10:30" をそのまま出す
	const d = new Date(v);
	return Number.isNaN(d.getTime())
		? ""
		: d.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			});
};
