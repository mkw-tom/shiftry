import type { Member } from "@shared/api/common/types/prismaLite";
import type { StaffPreferenceDTO } from "@shared/api/staffPreference/dto";
import type React from "react";

interface Props {
	members: Member[];
	staffPreferences: StaffPreferenceDTO[];
	onEdit: (userId: string, userName: string) => void;
}

const PreferenceList: React.FC<Props> = ({
	members,
	staffPreferences,
	onEdit,
}) => {
	return (
		<div className="overflow-y-auto h-[350px]">
			<div className="pb-20 w-full h-auto">
				{members.map((user) => {
					const pref = staffPreferences.find((p) => p.userId === user.user.id);
					let weekLabel = "";
					if (pref) {
						weekLabel = `週${pref.weekMin}~${pref.weekMax}`;
					}
					return (
						<div
							key={user.user.id}
							className="flex items-center gap-5 mb-4 w-full"
						>
							<div className="flex items-center w-5/6 gap-3">
								<div className="avatar">
									<div className="w-8 rounded-full">
										<img
											src={
												user.user.pictureUrl
													? user.user.pictureUrl
													: "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png"
											}
											alt={user.user.name || "User Avatar"}
										/>
									</div>
								</div>
								<span className="text-gray-700">{user.user.name}</span>
								{pref && (
									<span className="ml-auto text-xs text-gray-500 bg-gray-100 rounded px-2 py-1">
										{weekLabel}
									</span>
								)}
							</div>
							<button
								type="button"
								className="btn btn-xs ml-auto bg-white text-green01 border-1 border-green01 shadow-none"
								onClick={() => onEdit(user.user.id, user.user.name)}
							>
								編集
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PreferenceList;
