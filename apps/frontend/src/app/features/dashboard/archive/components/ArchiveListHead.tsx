import React from "react";
import { MdDelete } from "react-icons/md";
import { array } from "zod/v4-mini";
import { useToast } from "../../common/context/ToastProvider";
import { useDeleteManyShiftRequests } from "../api/delete-many-shift-request/hook";

const ArchiveListHead = ({
	ids,
	removeArchiveData,
	setFilterValue,
}: {
	ids: string[];
	removeArchiveData: () => void;
	setFilterValue: (value: number | "all") => void;
}) => {
	const { handleDeleteManyShiftRequests } = useDeleteManyShiftRequests();
	const { showToast } = useToast();
	const monthlyNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	const DeleteArchiveData = async () => {
		if (!window.confirm("本当に削除しますか？")) return;
		if (ids.length === 0) return;
		const res = await handleDeleteManyShiftRequests({ ids });
		if (res && "ok" in res && res.ok) {
			showToast(`${ids.length}件のデータを削除しました`, "success");
			removeArchiveData();
		} else {
			showToast("削除に失敗しました", "error");
		}
	};

	return (
		<div className="w-full mx-auto h-auto flex flex-col pt-5 shadow-sm bg-green02">
			<div className="w-full flex items-center justify-between mx-auto border-b-1 border-white pb-3 px-5">
				<div className="flex items-center flex-1 gap-2">
					<span className="text-sm text-white">表示：</span>
					<select
						defaultValue="ALL"
						className="select select-sm bg-base shadow-none w-32 font-bold border-gray-300 text-green02"
						onChange={(e) =>
							setFilterValue(
								e.target.value === "all"
									? "all"
									: Number.parseInt(e.target.value),
							)
						}
					>
						<option disabled={true}>絞り込みを選択</option>
						<option value="all">すべて</option>
						{monthlyNum.map((num) => (
							<option key={`${num}月`} value={num}>
								{num}月
							</option>
						))}
					</select>
				</div>

				<button
					type="button"
					className={`flex items-center btn btn-sm bg-green03 text-green02 border-none ${
						ids.length === 0 && "opacity-0"
					}`}
					disabled={ids.length === 0}
					onClick={DeleteArchiveData}
				>
					<MdDelete className="" />
					<span>削除</span>
					<span>（{ids.length}）</span>
				</button>
			</div>
		</div>
	);
};

export default ArchiveListHead;
