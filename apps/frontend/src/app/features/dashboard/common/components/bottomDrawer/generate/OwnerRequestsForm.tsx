import { OwnerRequestsType } from "@shared/shift/ai/validations/post-create";
import React, { useState } from "react";
import { CgEditFlipV } from "react-icons/cg";
import { MdAdd } from "react-icons/md";
import { useGenareteShift } from "../../../context/useGenerateShift";
import AddEditOwnerRequestModal from "./AddEditOwnerRequestModal";

const OwnerRequestsForm = () => {
	const { ownerRequests, setOwnerRequests } = useGenareteShift();
	const [ownerRequestInput, setOwnerRequestInput] = useState<{
		text: string;
		weight: number;
	}>({ text: "", weight: 0 });
	const [edit, setEdit] = useState<{ ok: boolean; idx: number | null }>({
		ok: false,
		idx: null,
	});
	const changeBadgeStyleOwnerRequest = (request: {
		text: string;
		weight: number;
	}): { label: string; style: string } => {
		switch (request.weight) {
			case 1:
				return { label: "低", style: "text-gray02" };
			case 2:
				return { label: "中", style: "text-green01" };
			case 3:
				return { label: "高", style: "badge-error" };
			default:
				console.warn(`Unexpected weight: ${request.weight}`);
				return { label: "null", style: "text-gray02" };
		}
	};

	const deleteOwnerRequest = (idx: number) => {
		if (!confirm("このリクエストデータ削除しますか？")) return;
		const deletedDatas = ownerRequests.filter((data, index) => idx !== index);
		setOwnerRequests(() => [...deletedDatas]);
	};

	const openAddEditOwnerRequestModal = (
		data: { text: string; weight: number } | null,
		idx: number | null,
	) => {
		if (data !== null) {
			setOwnerRequestInput({ text: data?.text, weight: data?.weight });
			setEdit({ ok: true, idx });
		}
		(
			document.getElementById("add_owner_request") as HTMLDialogElement | null
		)?.showModal();
	};

	const clearEdit = () => {
		setEdit({ ok: false, idx: null });
	};

	return (
		<div className="w-full h-[450px] overflow-hidden">
			<AddEditOwnerRequestModal
				edit={edit}
				clearEdit={clearEdit}
				ownerRequestInput={ownerRequestInput}
				setOwnerRequestInput={setOwnerRequestInput}
			/>
			<div className="w-full">
				<div className="w-11/12 mx-auto">
					{/* Open the modal using document.getElementById('ID').showModal() method */}
					<button
						type="button"
						className="btn btn-sm w-full mx-auto bg-green01 text-white border-none flex items-center gap-2 shadow-md"
						onClick={() => openAddEditOwnerRequestModal(null, null)}
					>
						<MdAdd />
						<span>優先度ルールの追加</span>
					</button>
				</div>
				<ul className="w-11/12 mx-auto h-[400px] overflow-y-scroll mt-3 pb-56">
					{ownerRequests.map((data, idx) => {
						const { label, style } = changeBadgeStyleOwnerRequest(data);
						return (
							<li
								key={data.text.slice(0, 3)}
								className="w-full text-black border-b-1 border-gray01 p-3 text-sm flex flex-col gap-2"
							>
								<p className={`badge badge-sm badge-dash ${style} pt-1`}>
									優先度：{label}
								</p>
								<p className="pl-2">{data.text}</p>
								<div className="w-full flex items-center justify-end">
									<button
										type="button"
										className="btn btn-sm btn-link bg-white text-green01"
										onClick={() => openAddEditOwnerRequestModal(data, idx)}
									>
										編集
									</button>
									<button
										type="button"
										className="btn btn-sm btn-link bg-white text-gray02"
										onClick={() => deleteOwnerRequest(idx)}
									>
										削除
									</button>
								</div>
							</li>
						);
					})}

					<div className="rating text-xs" />
				</ul>
			</div>
		</div>
	);
};

export default OwnerRequestsForm;
