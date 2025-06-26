import { RootState } from "@/app/redux/store";
import type React from "react";
import { useSelector } from "react-redux";

const SearchBar = ({
	membersFilter,
	setMembersFilter,
}: {
	membersFilter: "all" | "registed" | "notRegist";
	setMembersFilter: React.Dispatch<
		React.SetStateAction<"all" | "registed" | "notRegist">
	>;
}) => {
	return (
		<div className="w-full mx-auto border-b-0 mb-1 shadow-sm pt-3">
			<div className="w-full h-auto flex items-center rounded-t-sm pt-4 px-1 text-sm">
				<button
					type="button"
					className={`${
						membersFilter === "all"
							? "border-green02"
							: "border-base opacity-50"
					} text-center w-1/3 border-b-4 text-green02 pb-1 `}
					onClick={() => setMembersFilter("all")}
				>
					全員
				</button>
				<button
					type="button"
					className={`${
						membersFilter === "registed"
							? "border-green02"
							: "border-base opacity-50"
					} text-center w-1/3 border-b-4 text-green02 pb-1`}
					onClick={() => setMembersFilter("registed")}
				>
					登録済み
				</button>
				<button
					type="button"
					className={`${
						membersFilter === "notRegist"
							? "border-green02"
							: "border-base opacity-50"
					} text-center w-1/3 border-b-4 text-green02 pb-1`}
					onClick={() => setMembersFilter("notRegist")}
				>
					未登録
				</button>
			</div>
			<div className="flex items-center gap-1 p-2 border-b-1">
				<input
					className="w-full bg-gray01 text-black rounded-sm input input-sm text-[15px] outline-none border-gray01"
					placeholder="検索：スタッフ名"
				/>
				<button
					type="button"
					className="btn btn-sm bg-gray02 text-white border-gray02"
				>
					未登録スタッフ追加
				</button>
			</div>
		</div>
	);
};

export default SearchBar;
