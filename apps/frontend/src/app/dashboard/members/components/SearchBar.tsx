import type React from "react";
import { MdAdd } from "react-icons/md";

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
		<div className="w-full mx-auto bg-green02 pt-1">
			<div className="flex items-center gap-1 p-2">
				<input
					className="w-full bg-base text-black input input-sm text-[15px] outline-none border-gray01 rounded-md input-success"
					placeholder="検索：スタッフ名"
				/>
				<button
					type="button"
					className="btn btn-sm bg-white text-green02 border-none rounded-md"
				>
					<MdAdd />
					未登録スタッフ追加
				</button>
			</div>
		</div>
	);
};

export default SearchBar;
