import type { AiModifiedType } from "@shared/api/shift/ai/types/post-adjust.js";

type Profile = {
	uid: string;
	displayName?: string | null;
	pictureUrl?: string | null;
	// jobRolesなど他フィールドあってもOK
};

const FALLBACK_AVATAR = "https://example.com/default-avatar.png";

/** AI出力の ai_modified に対し、uidベースで displayName / pictureUrl を上書き */
export function hydrateAssignedFromProfiles(
	aiModified: AiModifiedType,
	memberProfiles: Profile[],
	opts?: { dropUnknownUid?: boolean }, // 不明uidを削除したい場合にtrue
) {
	const map = new Map<string, Profile>();
	for (const p of memberProfiles) map.set(p.uid, p);

	const unknownUids: string[] = [];

	for (const [date, slots] of Object.entries(aiModified ?? {})) {
		for (const [range, slot] of Object.entries(slots ?? {})) {
			const assigned = Array.isArray(slot.assigned) ? slot.assigned : [];
			const hydrated = [];

			for (const a of assigned) {
				const prof = map.get(a.uid);
				if (!prof) {
					unknownUids.push(a.uid);
					if (opts?.dropUnknownUid) continue; // ← 不明uidは破棄する運用ならこっち
					// 残す運用なら、最低限のフォールバックを入れておく
					hydrated.push({
						...a,
						displayName:
							a.displayName && a.displayName !== "氏名" ? a.displayName : a.uid,
						pictureUrl:
							a.pictureUrl && a.pictureUrl !== "URL"
								? a.pictureUrl
								: FALLBACK_AVATAR,
					});
					continue;
				}
				hydrated.push({
					...a,
					// ここで「氏名」「URL」等のプレースホルダを**必ず上書き**
					displayName: prof.displayName ?? a.displayName ?? a.uid,
					pictureUrl: prof.pictureUrl ?? a.pictureUrl ?? FALLBACK_AVATAR,
				});
			}

			slot.assigned = hydrated;
			slot.assignedCount = hydrated.length;
			slot.vacancies = Math.max(0, slot.count - hydrated.length);
		}
	}

	return { aiModified, unknownUids };
}
