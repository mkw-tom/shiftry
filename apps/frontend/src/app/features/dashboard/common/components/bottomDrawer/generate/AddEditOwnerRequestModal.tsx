import type React from "react";
import { MdAdd } from "react-icons/md";
import { useGenareteShift } from "../../../context/useGenerateShift";

const AddEditOwnerRequestModal = ({
	edit,
	clearEdit,
	ownerRequestInput,
	setOwnerRequestInput,
}: {
	edit: { ok: boolean; idx: number | null };
	ownerRequestInput: {
		text: string;
		weight: number;
	};
	clearEdit: () => void;
	setOwnerRequestInput: React.Dispatch<
		React.SetStateAction<{
			text: string;
			weight: number;
		}>
	>;
}) => {
	const { ownerRequests, setOwnerRequests } = useGenareteShift();

	const closeOwnerRequestModal = () => {
		setOwnerRequestInput({ text: "", weight: 0 });
		(
			document.getElementById("add_owner_request") as HTMLDialogElement | null
		)?.close();
		clearEdit();
	};

	const editOwnerRequest = (
		idx: number,
		updateData: { text: string; weight: number },
	) => {
		const newOwnerRequests = ownerRequests.map((data, index) =>
			index === idx ? updateData : data,
		);
		setOwnerRequests(newOwnerRequests);
	};

	const addOwnerRequest = () => {
		if (edit.ok && edit.idx !== null) {
			editOwnerRequest(edit.idx, ownerRequestInput);
		} else {
			setOwnerRequests((prev) => [...prev, ownerRequestInput]);
		}
		closeOwnerRequestModal();
	};

	const addRequestBtnDisabled =
		ownerRequestInput.text.length === 0 || ownerRequestInput.weight === 0;

	return (
		<dialog id="add_owner_request" className="modal w-full">
			<div className="modal-box bg-white">
				<h3 className="text-md opacity-70 text-black">
					優先度ルールの{edit.ok ? "編集" : "追加"}
				</h3>
				<div className="py-4 flex flex-col gap-4">
					<label className="flex flex-col gap-1">
						<span className="text-black opacity-70 text-sm">
							1. リクエストメッセージ
						</span>
						<textarea
							className="textarea textarea-success h-40 text-[16px] bg-white text-black"
							value={ownerRequestInput.text}
							onChange={(e) =>
								setOwnerRequestInput((prev) => ({
									...prev,
									text: e.target.value,
								}))
							}
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="text-black opacity-70 text-sm">
							2. 優先度の選択
						</span>
						<select
							className="select select-success w-1/2 bg-white text-black"
							onChange={(e) =>
								setOwnerRequestInput((prev) => ({
									...prev,
									weight: Number(e.target.value),
								}))
							}
							value={ownerRequestInput.weight}
						>
							<option disabled value={0}>
								優先度を選択
							</option>
							<option value={3}>高</option>
							<option value={2}>中</option>
							<option value={1}>低</option>
						</select>
					</label>
				</div>
				<div className="modal-action">
					<div className="w-full flex items-center gap-2">
						<button
							type="button"
							className="btn w-1/3 bg-gray02 text-white rounded-md border-none"
							onClick={closeOwnerRequestModal}
						>
							閉じる
						</button>
						<button
							type="button"
							className="btn w-2/3 bg-green01 text-white rounded-md border-none"
							onClick={addOwnerRequest}
							disabled={addRequestBtnDisabled}
						>
							<MdAdd />
							{edit.ok ? "更新" : "追加"}
						</button>
					</div>
				</div>
			</div>
		</dialog>
	);
};

export default AddEditOwnerRequestModal;
