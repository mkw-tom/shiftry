import type { Member } from "@shared/api/common/types/prismaLite";
import type { SubmittedShiftDTO } from "@shared/api/shift/submit/dto";
import type React from "react";

interface Props {
	members: Member[];
	submittedShiftList: SubmittedShiftDTO[];
	onOpenInfo: (userId: string) => void;
}

const SubmitList: React.FC<Props> = ({
	members,
	submittedShiftList,
	onOpenInfo,
}) => {
	if (members.length === 0) {
		return <div className="text-gray-400 mb-2">該当者なし</div>;
	}
	return (
		<div className="overflow-y-auto h-[350px]">
			<div className="pb-20 w-full h-auto">
				{members.map((user) => {
					const submitData = submittedShiftList.find(
						(s) => s.userId === user.user.id,
					);
					let badge = null;
					if (submitData?.status === "ADJUSTMENT") {
						badge = (
							<p className="flex items-center gap-1 mr-2">
								<span className="w-3 h-3 bg-warning rounded-full" />
								<span className="text-xs text-gray-600">調整中</span>
							</p>
						);
					} else if (submitData?.status === "CONFIRMED") {
						badge = (
							<p className="flex items-center gap-1 mr-2">
								<span className="w-3 h-3 bg-green-500 rounded-full" />
								<span className="text-xs text-gray-600">提出済</span>
							</p>
						);
					}
					return (
						<div key={user.user.id} className="flex items-center gap-3 mb-4">
							<div className="avatar">
								<div className="w-8 rounded-full">
									<img
										src={user.user.pictureUrl || ""}
										alt={user.user.name || "User Avatar"}
									/>
								</div>
							</div>
							<span className="text-gray-700 flex-1">{user.user.name}</span>
							{badge}
							<button
								type="button"
								className="btn btn-xs ml-auto bg-white text-green01 border-1 border-green01 shadow-none"
								onClick={() => onOpenInfo(user.user.id)}
							>
								開く
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SubmitList;
