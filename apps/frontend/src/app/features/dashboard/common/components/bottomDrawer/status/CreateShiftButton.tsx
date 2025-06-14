import { LuBrain } from "react-icons/lu";
import { RiRobot2Line } from "react-icons/ri";

const CreateShiftButton = () => {
	return (
		<div className="w-full flex items-center justify-between mx-auto">
			<button
				type="submit"
				className="btn flex-1 h-10 shadow-xl rounded-full font-bold text-sm text-white border-none bg-green01"
				onClick={() => {
					const modal = document.getElementById("create_shift_modal");
					if (modal instanceof HTMLDialogElement) {
						modal.showModal();
					}
				}}
			>
				シフト回収・作成
			</button>
			<dialog id="create_shift_modal" className="modal">
				<div className="modal-box bg-base text-black">
					<h3 className="text-black opacity-70">
						シフト作成の詳細条件（任意）
					</h3>
					<div className="py-4">
						<textarea
							placeholder="例：朝6時開始のシフトは〇〇さんを優先的に組んでください。"
							className="textarea textarea-success bg-base w-full h-40 border border-gray01 rounded-md p-2"
						/>
					</div>
					<div className="modal-action">
						<form
							method="dialog"
							className="flex items-center gap-2 w-full gap-1"
						>
							{/* if there is a button, it will close the modal */}
							<button
								type="submit"
								className="btn rounded-full bg-gray02 text-white border-none w-2/5"
							>
								キャンセル
							</button>
							<button
								type="submit"
								className="btn rounded-full bg-green02 text-white border-none flex items-center gap-2 w-3/5"
							>
								<LuBrain className="text-lg" />
								<span className="mr-2">AIシフト作成</span>
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	);
};

export default CreateShiftButton;
