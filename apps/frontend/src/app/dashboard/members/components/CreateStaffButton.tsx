import React from "react";
import { MdAddCircle } from "react-icons/md";

const CreateStaffButton = ({
	openStaffPreferenceModal,
}: {
	openStaffPreferenceModal: (userId?: string, userName?: string) => void;
}) => {
	return (
		<div className="flex gap-2 items-center mb-1 justify-start px-2 pt-2">
			<button
				type="button"
				className="btn btn-sm bg-white text-green01 border-green01 shadow-sm"
				onClick={() => openStaffPreferenceModal()}
			>
				<MdAddCircle />
				<span>スタッフ手動追加</span>
			</button>
			<p className="text-[10px] text-gray-500">
				lineグループに不参加もしくは本アプリ登録不可のスタッフのみ手動追加してください。
			</p>
		</div>
	);
};

export default CreateStaffButton;
