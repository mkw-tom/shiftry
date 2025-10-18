import type { Member } from "@shared/api/common/types/prismaLite";
import type React from "react";
import { IoWarning } from "react-icons/io5";
import { useAdjustShiftForm } from "../../context/AdjustShiftFormContextProvider.tsx";

const SuggestedAssinStaffList = ({
  allMembers,
  checkedUids,
  setCheckedUids,
  date,
  time,
  AiSuggestedStaffIds,
  previewVacancies,
}: {
  allMembers: (Member | undefined)[];
  checkedUids: string[];
  setCheckedUids: React.Dispatch<React.SetStateAction<string[]>>;
  date: string;
  time: string;
  AiSuggestedStaffIds?: string[];
  previewVacancies: number;
}) => {
  const { submittedShiftList, shiftRequestData } = useAdjustShiftForm();

  return (
    <ul className="mb-4 flex flex-col gap-2 w-full max-h-[400px] overflow-y-auto">
      {allMembers.length === 0 ? (
        <li className="text-gray-400">該当者なし</li>
      ) : (
        allMembers.map((m) => {
          if (!m) return null;
          // チェック状態
          const isChecked = checkedUids.includes(m.user.id);
          // 希望時間帯取得
          const submitted = submittedShiftList.find(
            (sub) => sub.userId === m.user.id
          );
          const hopeTime = submitted?.shifts[date] ?? null;
          // ポジションのtime（propsのtime）と一致 もしくは 範囲内に収まるか
          let isTimeMatch = hopeTime === time || hopeTime === "anytime";
          if (
            !isTimeMatch &&
            hopeTime &&
            hopeTime !== "anytime" &&
            hopeTime.includes("-") &&
            time.includes("-")
          ) {
            const toMinutes = (t: string) => {
              const [h, m] = t.split(":").map(Number);
              return h * 60 + m;
            };
            const [assignStartStr, assignEndStr] = time.split("-");
            const [hopeStartStr, hopeEndStr] = hopeTime.split("-");
            if (assignStartStr && assignEndStr && hopeStartStr && hopeEndStr) {
              const assignStart = toMinutes(assignStartStr);
              const assignEnd = toMinutes(assignEndStr);
              const hopeStart = toMinutes(hopeStartStr);
              const hopeEnd = toMinutes(hopeEndStr);
              // 希望時間帯がアサイン時間帯の範囲内に完全に収まる場合はマッチ扱い
              if (hopeStart >= assignStart && hopeEnd <= assignEnd) {
                isTimeMatch = true;
              }
            }
          }

          const isHope =
            Array.isArray(AiSuggestedStaffIds) &&
            AiSuggestedStaffIds.includes(m.user.id);
          let sourceBadge = null;
          const shiftPos = shiftRequestData.requests?.[date]?.[time];
          if (shiftPos) {
            if (shiftPos.absolute?.some((u) => u.id === m.user.id)) {
              sourceBadge = (
                <span className="badge badge-sm badge-dash text-info text-xs ml-1">
                  固定
                </span>
              );
            } else if (shiftPos.priority?.some((u) => u.id === m.user.id)) {
              sourceBadge = (
                <span className="badge badge-sm badge-dash text-green01 text-xs ml-1">
                  優先
                </span>
              );
            }
          }
          return (
            <li
              key={m.user.id}
              className={`flex items-center justify-between gap-2 w-full p-2 ${
                !isHope && !checkedUids.includes(m.user.id) ? "opacity-50" : ""
              } ${
                Array.isArray(AiSuggestedStaffIds) &&
                AiSuggestedStaffIds.includes(m.user.id)
                  ? "bg-purple-50"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <div />
                <img
                  src={m.user.pictureUrl ?? ""}
                  alt={m.user.name}
                  className={`w-8 h-8 rounded-full ${
                    Array.isArray(AiSuggestedStaffIds) &&
                    AiSuggestedStaffIds.includes(m.user.id)
                      ? "ring-2 ring-purple-400"
                      : ""
                  }`}
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        isHope
                          ? "font-bold text-gray-700"
                          : "font-bold text-gray-400"
                      }
                    >
                      {m.user.name}
                    </span>
                    <span
                      className={
                        isHope
                          ? "text-xs text-gray-500"
                          : "text-xs text-gray-400"
                      }
                    >
                      {m.role === "OWNER" ? "オーナー" : "スタッフ"}
                    </span>
                    {sourceBadge}
                    {/* {isAssignedOnly && (
                          <span className="text-xs text-blue-500 ml-2"></span>
                        )} */}
                  </div>

                  <div>
                    {/* 希望時間帯表示（存在する場合） */}
                    {hopeTime && hopeTime !== "anytime" && (
                      <span
                        className={
                          isTimeMatch
                            ? "text-xs text-green01 ml-2 flex items-center gap-1"
                            : "text-xs text-red-500 ml-2 flex items-center gap-1"
                        }
                      >
                        <IoWarning className={isTimeMatch ? "hidden" : ""} />
                        <p className="">希望時間: {hopeTime}</p>
                      </span>
                    )}
                    {hopeTime === "anytime" && (
                      <span className="text-xs text-green-500 ml-2">
                        いつでも可
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary mr-2"
                checked={isChecked}
                onChange={(e) => {
                  if (previewVacancies <= 0 && e.target.checked) return;
                  if (e.target.checked) {
                    setCheckedUids((prev) => [...prev, m.user.id]);
                  } else {
                    setCheckedUids((prev) =>
                      prev.filter((uid) => uid !== m.user.id)
                    );
                  }
                }}
              />
            </li>
          );
        })
      )}
    </ul>
  );
};

export default SuggestedAssinStaffList;
