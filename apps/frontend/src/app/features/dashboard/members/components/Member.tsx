import type { User } from "@shared/api/common/types/prisma";
import React from "react";

const Member = ({ user }: { user: User }) => {
	return (
		<li className="w-full h-auto bg-white  flex items-center border-b-1 border-b-gray01 ">
			<div className="flex justify-between p-5 w-full">
				<div className="w-1/2 flex items-center gap-4">
					{user.pictureUrl === null ? (
						<div className="w-8 h-8 rounded-full bg-gray01 " />
					) : (
						<img
							src={user.pictureUrl as string}
							alt="ユーザー画像"
							className="w-7 h-7 rounded-full "
						/>
					)}

					<p className="text-sm font-bold text-right text-black opacity-80 tracking-wider">
						{user.name}
					</p>
				</div>
				<div className="w-1/2 flex items-center  justify-end gap-5 ">
					{/* <p
						className={`text-xs ${
							user.role === "OWNER" ? "text-green01" : "text-blue01"
						}`}
					>
						{user.role === "OWNER" ? "オーナー" : "スタッフ"}
					</p> */}
					<button type="button" className="text-xs text-gray02 ">
						編集
					</button>
				</div>
			</div>
		</li>
	);
};

export default Member;
