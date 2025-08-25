import { LuCheck } from "react-icons/lu";

const ConfirmButton = () => {
	return (
		<div className="w-full h-10">
			<button
				type="submit"
				className="btn rounded-md bg-green02 text-white border-none flex items-center gap-2 w-full shadow-md"
			>
				{/* <LuBrain className="text-lg" /> */}
				<LuCheck />
				<span className="mr-2">シフトを確定</span>
			</button>
		</div>
	);
};

export default ConfirmButton;
