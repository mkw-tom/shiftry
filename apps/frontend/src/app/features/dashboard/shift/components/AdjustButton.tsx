import { LuBrain } from "react-icons/lu";
import AdjustModal from "./AdjustModal";

const AdjustButton = () => {
	return (
		<div className="w-1/2 h-10">
			<button
				type="submit"
				className="btn rounded-full bg-green02 text-white border-none flex items-center gap-2 w-full shadow-md"
				onClick={() => {
					const dialog = document.getElementById(
						"adjust_modal",
					) as HTMLDialogElement | null;
					dialog?.showModal();
				}}
			>
				<LuBrain className="text-lg" />
				<span className="mr-2">シフト調整</span>
			</button>
			<AdjustModal />
		</div>
	);
};

export default AdjustButton;
