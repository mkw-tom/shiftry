import { User } from "@shared/common/types/prisma";
import { useState } from "react";
import { BiArrowToRight } from "react-icons/bi";
import { PiUser } from "react-icons/pi";
import { RiTimeLine } from "react-icons/ri";

const dummyMembers: User[] = [
  {
    name: "たろう",
    id: "user-001",
    createdAt: new Date("2025-06-01T10:00:00Z"),
    updatedAt: new Date("2025-06-01T10:00:00Z"),
    lineId: "line_abc123",
    pictureUrl: "https://example.com/pic1.jpg",
    role: "STAFF",
  },
  {
    name: "じろう",
    id: "user-002",
    createdAt: new Date("2025-06-02T11:30:00Z"),
    updatedAt: new Date("2025-06-02T11:30:00Z"),
    lineId: "line_def456",
    pictureUrl: null,
    role: "OWNER",
  },
  {
    name: "さぶろう",
    id: "user-003",
    createdAt: new Date("2025-06-03T12:00:00Z"),
    updatedAt: new Date("2025-06-03T12:00:00Z"),
    lineId: "line_ghi78",
    pictureUrl: null,
    role: "STAFF",
  },
  {
    name: "すけどう",
    id: "user-004",
    createdAt: new Date("2025-06-04T13:00:00Z"),
    updatedAt: new Date("2025-06-04T13:00:00Z"),
    lineId: "line_jkl012",
    pictureUrl: null,
    role: "STAFF",
  }
];

const HandleAdjustModal = ({ assignUser, shift, date, positions }: { assignUser: { name: string; userId: string }, shift: { date: string; time: string } | undefined, date: { label: string; key: string }, positions: string[] }) => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  return (
    <dialog id={`handle_adjust_modal_${date.key}${shift?.time}${assignUser.userId}`} className="modal modal-bottom sm:modal-middle ">
      <div className="modal-box bg-base">
        <h3 className="font-bold text-lg opacity-70 font-thin text-black text-start">手動シフト調整</h3>
        <ul className="mt-1">
          <li className="opacity-70 font-thin text-black text-start flex items-center gap-2">
            <RiTimeLine className="inline-block text-lg" />
            <span className="font-thin text-black text-start">{date.label}</span>
            <span className="font-thin text-black text-start">{shift?.time !== undefined ? shift.time : "休み"}</span></li>
          <li className="opacity-70 font-thin text-black text-start flex items-center gap-2">
            <PiUser className="inline-block text-lg" />
            <span className="font-thin text-black text-start">{assignUser.name}</span>
          </li>
        </ul>
        <div className="my-3">
          {/* <label className="flex flex-col gap-2 mt-2">
            <span className="text-sm opacity-70 font-thin text-black text-start">スタッフ交代</span>
            <div className="flex items-center gap-1">
              <input
                type="text"
                className="input input-bordered  bg-gray01 text-black outline-none border-none pointer-events-none"
                value={assignUser.name}
              // value={adjustDateRange.start}
              // onChange={(e) => handleStartDateChange(e.target.value)}
              />
              <span className="text-lg opacity-70 font-thin text-black mx-1"><BiArrowToRight /></span>
              <select defaultValue="Pick a Runtime" className="select select-success bg-gray01">
                <option disabled={true}>Pick a Runtime</option>
                {dummyMembers.map((member) => (
                  <option key={member.id} value={member.name}>{member.name}</option>
                ))}
              </select>
            </div>
          </label> */}
          {shift?.time !== undefined ? (
            
          <label className="flex flex-col gap-2">
            <span className="text-sm opacity-70 font-thin text-black text-start">シフト変更</span>
            <div className="flex items-center gap-1">
              <input
                type="text"
                className="input input-bordered  bg-gray01 text-black outline-none border-none pointer-events-none"
                value={shift?.time}
                readOnly
              />
              <span className="text-lg opacity-70 font-thin text-black mx-1"><BiArrowToRight /></span>
              <select defaultValue="Pick a Runtime" className="select select-success bg-gray01" onChange={(e) => setSelectedPosition(e.target.value)}>
                <option disabled={true}>シフトを選択</option>
                {positions.map((position, index) => (
                  <option key={index} value={position}>{position} </option>
                ))}
              </select>
            </div>
          </label>
          ) : (
            <label className="flex flex-col gap-2">
            <span className="text-sm opacity-70 font-thin text-black text-start">シフト変更</span>
            <div className="flex items-center gap-1">
              <select defaultValue="Pick a Runtime" className="select select-success bg-gray01" onChange={(e) => setSelectedPosition(e.target.value)}>
                <option disabled={true}>シフトを選択</option>
                {positions.map((position, index) => (
                  <option key={index} value={position}>{position} </option>
                ))}
              </select>
            </div>
          </label>
          )}
        </div>
        <div className="modal-action">
          <form method="dialog" className="w-full flex items-center gap-1">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn bg-gray02 text-white rounded-full w-1/3">閉じる</button>
            <button className="btn bg-green02 text-white rounded-full w-2/3">変更</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default HandleAdjustModal;