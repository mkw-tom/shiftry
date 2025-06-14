import { MDW } from "@/app/features/common/hooks/useFormatDate";
import { AssignShiftWithJson, ShiftRequestWithJson } from "./ShiftContent";
import HandleAdjustModal from "./HandleAdjustModal";

const ShiftTable = ({ dates, assignShift, shiftRequest }: { dates: { label: string; key: string }[], assignShift: AssignShiftWithJson, shiftRequest: ShiftRequestWithJson }) => {
  const ShiftsContents = assignShift.shifts;
  return (
    <div className="w-full  md:w-11/12 h-auto overflow-x-scroll">
      <table className="w-full h-auto border border-gray01 overflow-x-auto">
        <thead className="bg-gray-100 ">
          <tr>
            <th className="w-24 sticky left-0 bg-gray-100 z-10 border-1 border-gray01">
              <button className="w-full h-full text-xs w-5"></button>
            </th>
            {dates.map((date) => (
              <th key={date.key} className="px-2 py-1 text-center text-black opacity-70 border-1 border-gray01 text-xs sm:text-sm md:text-md">{date.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ShiftsContents.map((data) => (
            <tr key={data.userId}>
              <td className="border border-gray01 flex flex-col items-center py-2 min-w-16 sticky left-0 bg-white z-30 h-full ">
                <div className="w-7 h-7 rounded-full bg-gray-300 mb-1" />
                <span className="text-black opacity-70 text-xs sm:text-sm md:text-md">{data.userName}</span>
              </td>
              {dates.map((date, j) => {
                const shift = data.shifts.find((s: { date: string; time: string }) => s.date === date.key);
                const dayOfWeek = new Date(date.key).toLocaleDateString("en-US", { weekday: "long" }) as keyof typeof shiftRequest.requests.defaultTimePositions;
                const positions = shiftRequest.requests.overrideDates[date.key] || shiftRequest.requests.defaultTimePositions[dayOfWeek] || [];
                return (
                  <td key={j} className="border border-gray01 text-center min-w-16 align-middle bg-white hover:bg-green03 cursor-pointer" onClick={() => {
                    const dialog = document.getElementById(`handle_adjust_modal_${date.key}${shift?.time}${data.userId}`) as HTMLDialogElement | null;
                    dialog?.showModal();
                  }}>
                    <div className="flex flex-col items-center justify-center h-full">
                      {shift && shift.time ? (
                        shift.time.includes("-") ? (
                          <div className="flex flex-col lg:flex-row items-center justify-center h-full ">
                            <div className="text-green02">{shift.time.split("-")[0]}</div>
                            <div className="border-t border-gray01 w-8 mx-auto lg:hidden" />
                            <div className="hidden lg:block text-black opacity-70 mx-1">~</div>
                            <div className="text-green02">{shift.time.split("-")[1]}</div>
                          </div>
                        ) : (
                          <span className="text-xl text-black opacity-70">{shift.time}</span>
                        )
                      ) : (
                        <span className="font-bold text-xl text-black opacity-70">×</span>
                      )}
                    </div>
                    <HandleAdjustModal assignUser={{name: data.userName, userId: data.userId}} shift={shift} date={date} positions={positions}/>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftTable;