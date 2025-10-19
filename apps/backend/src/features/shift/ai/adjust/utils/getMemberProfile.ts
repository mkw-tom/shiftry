import type { MemberProfileInput } from "@shared/api/shift/ai/validations/post-adjust.js";

export function getPictureUrlByUid(
	memberProfiles: MemberProfileInput[],
	uid: string,
) {
	const found = memberProfiles.find((m) => m.uid === uid);
	return found?.pictureUrl ?? null;
}
