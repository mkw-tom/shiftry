import type {
  ShiftsOfAssignType,
  ShiftsOfRequestsType,
} from "@shared/common/types/json";
import type { DayOfWeek } from "@shared/shift/ai/types/post-create";
import type { shiftOfSubmittdWithUserId } from "@shared/shift/ai/validations/post-create";

// 対象期間の週数を算出（例: 12/01〜12/31 → 5週）
function getWeeksBetween(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (7 * 24 * 60 * 60 * 1000));
}

export const generateInitialShift = (
  submittedShifts: shiftOfSubmittdWithUserId[],
  shiftRequest: ShiftsOfRequestsType,
  startDate: string,
  endDate: string,
): ShiftsOfAssignType[] => {
  const slots: { [key: string]: { count: number; assigned: string[] } } = {};

  const overrideDateSet = new Set(Object.keys(shiftRequest.overrideDates));
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalWeeks = getWeeksBetween(start, end);

  // ① defaultTimePositions → 日付化、overrideDates と重複してたらスキップ
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split("T")[0];
    if (overrideDateSet.has(dateStr)) continue;

    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const defaultSlots = shiftRequest.defaultTimePositions[weekday as DayOfWeek] || [];

    for (const timeWithCount of defaultSlots) {
      const [time, countStr] = timeWithCount.split("*");
      const count = Number.parseInt(countStr);
      slots[`${dateStr}&${time}`] = { count, assigned: [] };
    }
  }

  // ② overrideDates を優先して反映
  for (const [date, timeArray] of Object.entries(shiftRequest.overrideDates)) {
    for (const timeWithCount of timeArray) {
      const [time, countStr] = timeWithCount.split("*");
      const count = Number.parseInt(countStr);
      slots[`${date}&${time}`] = { count, assigned: [] };
    }
  }

  // ③ 各ユーザーに対して希望に基づいて割り当て
  const assignments: ShiftsOfAssignType[] = [];

  for (const submittedData of submittedShifts) {
    const {
      userId,
      name: userName,
      availableWeeks,
      specificDates,
      weekCountMax,
    } = submittedData;

    const preferencesWithTime: string[] = [];
    const preferencesWithoutTime: DayOfWeek[] = [];

    // ③-a availableWeeks を分離（時間指定あり or なし）
    for (const entry of availableWeeks) {
      const [day, time] = entry.split("&") as [DayOfWeek, string | undefined];
      if (time) {
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
          const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
          if (weekday === day) {
            const dateStr = date.toISOString().split("T")[0];
            preferencesWithTime.push(`${dateStr}&${time}`);
          }
        }
      } else {
        preferencesWithoutTime.push(day);
      }
    }

    // ③-b specificDates → 時間あり/なしを考慮して追加
    for (const dateEntry of specificDates) {
      const [dateStr, time] = dateEntry.split("&");
      const date = new Date(dateStr);
      if (date < start || date > end) continue;

      if (time) {
        preferencesWithTime.push(`${dateStr}&${time}`);
      } else {
        const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
        const defaultTimes = shiftRequest.defaultTimePositions[weekday as DayOfWeek] || [];
        for (const timeWithCount of defaultTimes) {
          const [defaultTime] = timeWithCount.split("*");
          preferencesWithTime.push(`${dateStr}&${defaultTime}`);
        }
      }
    }

    // ③-c 時間指定あり → 優先的に割り当て
    const assignedShifts: { date: string; time: string }[] = [];
    let count = 0;
    const shiftLimit = weekCountMax * totalWeeks;

    for (const pref of preferencesWithTime) {
      if (count >= shiftLimit) break;
      const slot = slots[pref];
      if (
        slot &&
        slot.assigned.length < slot.count &&
        !slot.assigned.includes(userId)
      ) {
        const [date, time] = pref.split("&");
        const alreadyAssigned = assignedShifts.some(
          (shift) => shift.date === date && shift.time === time,
        );
        if (!alreadyAssigned) {
          slot.assigned.push(userId);
          assignedShifts.push({ date, time });
          count++;
        }
      }
    }

    // ③-d 時間未指定（曜日のみ） → 残り枠に後からアサイン
    for (const day of preferencesWithoutTime) {
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        if (count >= shiftLimit) break;

        const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
        if (weekday !== day) continue;

        const dateStr = date.toISOString().split("T")[0];
        const defaultTimes = shiftRequest.defaultTimePositions[weekday as DayOfWeek] || [];

        for (const timeWithCount of defaultTimes) {
          const [time] = timeWithCount.split("*");
          const key = `${dateStr}&${time}`;
          const slot = slots[key];

          if (
            slot &&
            slot.assigned.length < slot.count &&
            !slot.assigned.includes(userId)
          ) {
            const alreadyAssigned = assignedShifts.some(
              (shift) => shift.date === dateStr && shift.time === time,
            );
            if (!alreadyAssigned) {
              slot.assigned.push(userId);
              assignedShifts.push({ date: dateStr, time });
              count++;
              break; // 同じ日で2枠以上入れない（1日1枠ルール）
            }
          }
        }
      }
    }

    assignments.push({
      userId,
      userName,
      shifts: assignedShifts,
    });
  }

  return assignments;
};
