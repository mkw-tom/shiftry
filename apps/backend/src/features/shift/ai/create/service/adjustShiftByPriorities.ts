import type {
	ShiftsOfAssignType,
	ShiftsOfRequestsType,
} from "@shared/common/types/json";
import type { DayOfWeek } from "@shared/shift/ai/types/post-create";
import type {
	PriorityType,
	shiftOfSubmittdWithUserId,
} from "@shared/shift/ai/validations/post-create";
// 対象日付群から週数を推定（例: 月曜~日曜で1週カウント）
function estimateTotalWeeks(dateWeekMap: {
	[date: string]: DayOfWeek;
}): number {
	const sortedDates = Object.keys(dateWeekMap).sort();
	const first = new Date(sortedDates[0]);
	const last = new Date(sortedDates[sortedDates.length - 1]);
	const msPerWeek = 7 * 24 * 60 * 60 * 1000;
	return Math.max(1, Math.ceil((last.getTime() - first.getTime()) / msPerWeek));
}

export const adjustShiftByPriorities = ({
	submittedShifts,
	shiftRequest,
	priorities,
	dateWeekMap,
}: {
	submittedShifts: shiftOfSubmittdWithUserId[];
	shiftRequest: ShiftsOfRequestsType;
	priorities: PriorityType[];
	dateWeekMap: { [date: string]: DayOfWeek };
}): ShiftsOfAssignType[] => {
	const priorityMap = new Map(priorities.map((p) => [p.userId, p]));
	const assignCount = new Map<string, number>();
	const resultMap = new Map<string, { date: string; time: string }[]>();
	const allSlotsSet = new Set<string>();
	const overrideDateSet = new Set(Object.keys(shiftRequest.overrideDates));

	const totalWeeks = estimateTotalWeeks(dateWeekMap);

	// 1. defaultTimePositions（overrideDateに該当する日付は無視）
	for (const [date, weekday] of Object.entries(dateWeekMap)) {
		if (overrideDateSet.has(date)) continue;
		const slots = shiftRequest.defaultTimePositions[weekday] || [];
		for (const slot of slots) {
			const [time] = slot.split("*");
			allSlotsSet.add(`${date}&${time}`);
		}
	}

	// 2. overrideDates を優先的に追加
	for (const [date, slots] of Object.entries(shiftRequest.overrideDates)) {
		for (const slot of slots) {
			const [time] = slot.split("*");
			allSlotsSet.add(`${date}&${time}`);
		}
	}

	const allSlots = Array.from(allSlotsSet).map((s) => {
		const [date, time] = s.split("&");
		return { date, time };
	});

	// 3. スロットごとに候補者スコア計算
	const shiftAssignments: {
		[key: string]: { userId: string; score: number }[];
	} = {};

	for (const slot of allSlots) {
		const weekday = dateWeekMap[slot.date];
		const candidates: { userId: string; score: number }[] = [];

		for (const member of submittedShifts) {
			const { userId, availableWeeks, specificDates } = member;

			const canWork =
				availableWeeks.includes(`${weekday}&${slot.time}`) ||
				specificDates.includes(`${slot.date}&${slot.time}`) ||
				specificDates.includes(slot.date);

			if (!canWork) continue;

			const priority = priorityMap.get(userId);
			let score = 0;

			if (priority) {
				if (priority.weight) score += priority.weight * 10;
				if (priority.preferredDays?.includes(weekday)) score += 3;
				if (priority.preferTime) {
					const start = Number(slot.time.split(":")[0]);
					if (priority.preferTime === "morning" && start < 12) score += 2;
					if (priority.preferTime === "afternoon" && start >= 12) score += 2;
					if (
						typeof priority.preferTime === "object" &&
						`${priority.preferTime.start}-${priority.preferTime.end}` ===
							slot.time
					) {
						score += 3;
					}
				}
			}

			candidates.push({ userId, score });
		}

		shiftAssignments[`${slot.date}&${slot.time}`] = candidates.sort(
			(a, b) => b.score - a.score,
		);
	}

	// 4. 割り当て処理（週数補正した上限に従って）
	for (const slot of allSlots) {
		const key = `${slot.date}&${slot.time}`;
		const candidates = shiftAssignments[key];

		for (const { userId } of candidates) {
			const count = assignCount.get(userId) || 0;
			const baseLimit =
				submittedShifts.find((m) => m.userId === userId)?.weekCountMax ?? 999;
			const limit = baseLimit * totalWeeks;

			const alreadyAssigned = (resultMap.get(userId) ?? []).some(
				(s) => s.date === slot.date && s.time === slot.time,
			);

			if (count < limit && !alreadyAssigned) {
				resultMap.set(userId, [...(resultMap.get(userId) ?? []), slot]);
				assignCount.set(userId, count + 1);
				break;
			}
		}
	}

	// 5. 整形して返却
	return submittedShifts.map((member) => ({
		userId: member.userId,
		userName: member.name,
		shifts: resultMap.get(member.userId) ?? [],
	}));
};
