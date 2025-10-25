import { YMDW } from "@shared/utils/formatDate";
import type React from "react";

interface Props {
	startDate: Date;
	endDate: Date;
	onClose: () => void;
}

const SubmitStatusHead: React.FC<Props> = ({ startDate, endDate, onClose }) => {
	return (
		<>
			<button
				type="button"
				className="flex w-full justify-center mb-5 -mt-3"
				onClick={onClose}
			>
				<div className="bg-gray02 w-1/4 rounded-full h-1.5" />
			</button>
			<h3 className="font-bold  text-gray-650 mb-1 text-gray-700">
				シフト希望状況
			</h3>
			<h3 className="text-gray-600 text-sm mb-3 ml-1">
				{YMDW(startDate)} ~ {YMDW(endDate)}
			</h3>
		</>
	);
};

export default SubmitStatusHead;
