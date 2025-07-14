import type { ShiftStatus } from "@shared/api/common/types/prisma";
import AdjustButton from "./AdjustButton";
import ConfirmButton from "./ConfirmButton";
import DownloadButton from "./DownloadButton";
import ReAdjustButton from "./ReAdjustButton";

const ShiftButtons = ({ status }: { status: ShiftStatus }) => {
	if (status === "ADJUSTMENT") {
		return (
			<div className="fixed bottom-10 right-0 left-0 w-full flex justify-between md:w-11/12 px-2 gap-2 z-30 mx-auto">
				{/* <AdjustButton /> */}
				<ConfirmButton />
			</div>
		);
	}
	if (status === "CONFIRMED") {
		return (
			<div className="fixed bottom-10 right-0 left-0 w-full flex justify-between md:w-11/12 px-2 gap-2 z-30 mx-auto">
				<DownloadButton />
				<ReAdjustButton />
			</div>
		);
	}
};

export default ShiftButtons;
