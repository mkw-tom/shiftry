import type { Member } from "@shared/api/common/types/prismaLite";
import type React from "react";

interface Props {
	members: Member[];
}

const NotSubmitList: React.FC<Props> = ({ members }) => {
	if (members.length === 0) {
		return <div className="text-gray-400">該当者なし</div>;
	}
	return (
		<div className="overflow-y-auto h-[350px]">
			<div className="pb-20 w-full h-auto">
				{members.map((user) => (
					<div key={user.user.id} className="flex items-center gap-3 mb-4">
						<div className="avatar">
							<div className="w-8 rounded-full">
								<img
									src={user.user.pictureUrl || ""}
									alt={user.user.name || "User Avatar"}
								/>
							</div>
						</div>
						<span className="text-gray-700">{user.user.name}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default NotSubmitList;
