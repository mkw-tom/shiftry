import { MDW } from "@/app/features/common/hooks/useFormatDate";
import type {
	AssignShiftWithJson,
	ShiftRequestWithJson,
} from "@shared/common/types/merged";
import type { Dispatch, SetStateAction } from "react";
import HandleAdjustModal from "./HandleAdjustModal";

const ShiftTable = ({
	dates,
	assignShift,
	shiftRequest,
	setAssignShift,
}: {
	dates: { label: string; key: string }[];
	assignShift: AssignShiftWithJson;
	shiftRequest: ShiftRequestWithJson;
	setAssignShift: Dispatch<SetStateAction<AssignShiftWithJson | null>>;
}) => {
	const ShiftsContents = assignShift.shifts;

	const openHandleAdjustModal = (
		date: string,
		shift: string | undefined,
		userId: string,
	) => {
		const dialog = document.getElementById(
			`handle_adjust_modal_${date}${shift}${userId}`,
		) as HTMLDialogElement | null;
		dialog?.showModal();
	};

	return (
		<div className="w-full  md:w-11/12 h-auto overflow-x-scroll">
			<table className="w-full h-auto border border-gray01 overflow-x-auto">
				<thead className="bg-gray-100 ">
					<tr>
						<th className="w-24 sticky left-0 bg-gray-100 z-10 border-1 border-gray01">
							{/* <button type="button" className="w-full h-full text-xs w-5" /> */}
						</th>
						{dates.map((date) => (
							<th
								key={date.key}
								className="px-2 py-1 text-center text-black opacity-70 border-1 border-gray01 text-xs sm:text-sm md:text-md"
							>
								{date.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{ShiftsContents.map((data) => (
						<tr key={data.userId}>
							<td className="border border-gray01 flex flex-col items-center py-2 min-w-16 sticky left-0 bg-white z-10 h-full ">
								<div className="w-7 h-7 rounded-full bg-gray-300 mb-1" />
								<span className="text-black opacity-70 text-xs sm:text-sm md:text-md">
									{data.userName}
								</span>
							</td>
							{dates.map((date, j) => {
								const shift = data.shifts.find(
									(s: { date: string; time: string }) => s.date === date.key,
								);
								const { defaultTimePositions, overrideDates } =
									shiftRequest.requests;
								const dayOfWeek = new Date(date.key).toLocaleDateString(
									"en-US",
									{ weekday: "long" },
								) as keyof typeof defaultTimePositions;
								const override = overrideDates?.[date.key];
								const defaultPositions = defaultTimePositions?.[dayOfWeek];
								const positions = override?.length
									? override
									: (defaultPositions ?? []);

								if (positions.length === 0)
									return (
										<td
											key={date.key}
											className="border border-gray01 text-center min-w-16 align-middle cursor-pointer bg-gray-100"
										/>
									);

								return (
									<td
										key={date.key}
										className="border border-gray01 text-center min-w-16 align-middle bg-white hover:bg-green03 cursor-pointer"
										onClick={() =>
											openHandleAdjustModal(date.key, shift?.time, data.userId)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												openHandleAdjustModal(
													date.key,
													shift?.time,
													data.userId,
												);
											}
										}}
									>
										<div className="flex flex-col items-center justify-center h-full">
											{shift?.time ? (
												shift.time.includes("-") ? (
													<div className="flex flex-col lg:flex-row items-center justify-center h-full ">
														<div className="text-green02">
															{shift.time.split("-")[0]}
														</div>
														<div className="border-t border-gray01 w-8 mx-auto lg:hidden" />
														<div className="hidden lg:block text-black opacity-70 mx-1">
															~
														</div>
														<div className="text-green02">
															{shift.time.split("-")[1]}
														</div>
													</div>
												) : (
													<span className="text-xl text-black opacity-70">
														{shift.time}
													</span>
												)
											) : (
												<span className="font-bold text-xl text-black opacity-70">
													×
												</span>
											)}
										</div>
										<HandleAdjustModal
											assignUser={{ name: data.userName, userId: data.userId }}
											shift={shift}
											date={date}
											positions={positions}
											setAssignShift={setAssignShift}
											assignShift={assignShift}
										/>
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
