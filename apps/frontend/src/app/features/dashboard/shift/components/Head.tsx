import { MDW } from "@shared/utils/formatDate";
import type { Dispatch, SetStateAction } from "react";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";

const Head = ({
	dates,
	tableSlice,
	setTableSlice,
}: {
	dates: { label: string; key: string }[];
	tableSlice: { start: number; end: number };
	setTableSlice: Dispatch<SetStateAction<{ start: number; end: number }>>;
}) => {
	const SLICE_WIDTH = 7; // 1ページあたりの表示日数

	const handleLeftClick = () => {
		if (tableSlice.start === 0) return;
		setTableSlice((prev) => {
			//     const newStart = Math.max(prev.start - SLICE_WIDTH, 0);
			// const newEnd = newStart + SLICE_WIDTH;
			return { start: prev.start - 7, end: prev.end - 7 };
		});
	};

	const handleRightClick = () => {
		if (tableSlice.end >= dates.length) return;
		setTableSlice((prev) => {
			return { start: prev.start + 7, end: prev.end + 7 };
		});
	};

	const startDate = dates[tableSlice.start]?.key ?? "";
	const endDate = dates[tableSlice.end - 1]?.key ?? "";

	return (
		<div className="w-11/12 h-auto">
			<div className="w-full h-16 flex flex-col items-center mx-auto gap-2">
				<h2 className="text-black text-lg font-bold text-center border-b-1 border-b-gray01 w-full">
					{MDW(new Date(dates[0].key))} ~{" "}
					{MDW(new Date(dates[dates.length - 1].key))}
				</h2>
				<div className="w-full flex items-center justify-bettween">
					<button
						type="button"
						className={`w-10 h-10 flex items-center justify-center text-black text-2xl hover:text-4xl transition-all duration-300 ${tableSlice.start === 0 ? "opacity-10    cursor-not-allowed" : ""}`}
						onClick={handleLeftClick}
						disabled={tableSlice.start === 0}
					>
						<BiSolidLeftArrow />
					</button>
					<h2 className="text-black text-center flex-1">
						{startDate && endDate
							? `${MDW(new Date(startDate))} ~ ${MDW(new Date(endDate))}`
							: `~ ${MDW(new Date(dates[dates.length - 1].key))}`}
					</h2>
					<button
						type="button"
						className={`w-10 h-10 flex items-center justify-center text-black text-2xl hover:text-4xl transition-all duration-300 ${tableSlice.end >= dates.length ? "opacity-10 cursor-not-allowed" : ""}`}
						onClick={handleRightClick}
						disabled={tableSlice.end >= dates.length}
					>
						<BiSolidRightArrow />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Head;
