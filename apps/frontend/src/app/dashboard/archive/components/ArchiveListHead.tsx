import React from "react";
import { MdDelete } from "react-icons/md";
import { array } from "zod/v4-mini";

import { traceDeprecation } from "node:process";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { FiArchive, FiFilter } from "react-icons/fi";
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
		const res = await handleDeleteManyShiftRequests(ids);
		if (res && "ok" in res && res.ok) {
			showToast(`${res.deletedCount}件のデータを削除しました`, "success");
			removeArchiveData();
		} else {
			showToast("削除に失敗しました", "error");
		}
	};

	return (
		<div className="w-full mx-auto h-auto flex flex-col pt-2 shadow-sm bg-white border-y-2 border-y-base">
			<div className="w-full flex items-center justify-between mx-auto border-b-1 border-white pb-2 px-5">
				<div className="flex items-center gap-2 text-green02">
					期間：
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
