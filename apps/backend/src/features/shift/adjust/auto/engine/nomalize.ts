import type {
	MemberProfileInput,
	SubmissionsInput,
	TemplateShiftInput,
} from "@shared/api/shift/adjust/validations/auto.js";

export const normalizeRange = (raw: unknown): string | null => {
	if (typeof raw !== "string") return null;
	const s = raw
		.replace(/[：]/g, ":")
		.replace(/[－—–〜~]/g, "-")
		.replace(/\s/g, "");
	const m = s.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
	if (!m) return null;
	const pad2 = (n: string) => n.padStart(2, "0");
	return `${pad2(m[1])}:${m[2]}-${pad2(m[3])}:${m[4]}`;
};

export const safeTimeToMin = (hhmm: string) => {
	const [h, m] = hhmm.split(":").map(Number);
	return h * 60 + m;
};

export const safeParseRange = (rangeLike: string | null | undefined) => {
	const norm = normalizeRange(rangeLike ?? null);
	if (!norm) return null;
	const [s, e] = norm.split("-");
	return { start: safeTimeToMin(s), end: safeTimeToMin(e), norm };
};

export const overlapRange = (a: string, b: string) => {
	const A = safeParseRange(a);
	const B = safeParseRange(b);
	if (!A || !B) return false;
	return Math.max(A.start, B.start) < Math.min(A.end, B.end);
};

export const containsFully = (outer: string, inner: string) => {
	const A = safeParseRange(outer);
	const B = safeParseRange(inner);
	if (!A || !B) return false;
	return A.start <= B.start && A.end >= B.end;
};

// 提出値の正規化："null"/null/undefined → null, "anytime"は温存, 形式外はnull
export const normalizeSubmissionValue = (
	v: unknown,
): "anytime" | string | null => {
	if (v === null || v === undefined) return null;
	if (v === "null") return null;
	if (v === "anytime") return "anytime";
	if (typeof v === "string") {
		const norm = normalizeRange(v);
		return norm ?? null;
	}
	return null;
};

/* =========================
 * インデックス構築
 * ========================= */
export function buildSubmissionsIndex(subs: SubmissionsInput[]) {
	const byUser = new Map<string, SubmissionsInput>();
	const byDate = new Map<string, Map<string, string | "anytime" | null>>();
	for (const s of subs) {
		byUser.set(s.userId, s);
		const entries = Object.entries(s.shifts ?? {});
		for (const [date, raw] of entries) {
			if (!byDate.has(date)) byDate.set(date, new Map());
			const v = normalizeSubmissionValue(raw);
			byDate.get(date)?.set(s.userId, v);
		}
	}
	return { byUser, byDate };
}

export function buildProfilesIndex(profiles: MemberProfileInput[]) {
	const name = new Map<string, string>();
	const pic = new Map<string, string>();
	const roles = new Map<string, Set<string>>();
	for (const m of profiles) {
		if (m.displayName) name.set(m.uid, m.displayName);
		if (m.pictureUrl) pic.set(m.uid, m.pictureUrl);
		roles.set(m.uid, new Set(m.jobRoles ?? []));
	}
	return { name, pic, roles };
}

export function buildAbsPri(template: TemplateShiftInput) {
	const abs = new Map<string, Map<string, Set<string>>>();
	const pri = new Map<string, Map<string, Map<string, number>>>();
	for (const [d, slots] of Object.entries(template.requests ?? {})) {
		if (!slots) continue; // その日が null の場合はスキップ
		if (!abs.has(d)) abs.set(d, new Map());
		if (!pri.has(d)) pri.set(d, new Map());
		for (const [rangeRaw, def] of Object.entries(slots ?? {})) {
			const range = normalizeRange(rangeRaw);
			if (!range) continue; // 不正キーは無視
			const aset = new Set((def.absolute ?? []).map((a) => a.id));
			const pmap = new Map<string, number>();
			for (const p of def.priority ?? []) pmap.set(p.id, p.level ?? 999);
			abs.get(d)?.set(range, aset);
			pri.get(d)?.set(range, pmap);
		}
	}
	return { abs, pri };
}
