import type { User } from "@shared/common/types/prisma";
import React from "react";

const Member = ({ user }: { user: User }) => {
	return (
		<li className="w-full h-10 bg-white shadow-md flex items-center">
			<div className="flex justify-between px-4 py-3 w-full">
				<div className="w-1/2 flex items-center gap-3">
					<img
						src={user.pictureUrl as string}
						alt="ユーザー画像"
						className="w-7 h-7 rounded-full "
					/>
					<p className="text-xs font-bold text-right text-black">{user.name}</p>
				</div>
				<div className="w-1/2 flex items-center  justify-end gap-5 ">
					<p
						className={`text-xs ${
							user.role === "OWNER" ? "text-green01" : "text-blue01"
						}`}
					>
						{user.role === "OWNER" ? "オーナー" : "スタッフ"}
					</p>
					<button type="button" className="text-xs text-gray02 ">
						編集
					</button>
				</div>
			</div>
		</li>
	);
};

export default Member;
