import { LuBrain } from "react-icons/lu";

const ReAdjustButton = () => {
	return (
		<div className="w-1/2 h-10">
			<button
				type="submit"
				className="btn rounded-full bg-green02 text-white border-none flex items-center gap-2 w-full shadow-md"
			>
				<LuBrain className="text-lg" />
				<span className="mr-2">再調整</span>
			</button>
		</div>
	);
};
export default ReAdjustButton;
