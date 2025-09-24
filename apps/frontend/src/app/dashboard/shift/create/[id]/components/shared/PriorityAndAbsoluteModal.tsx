import { UserLite } from "@shared/api/common/types/prismaLite";
import type {
	AbsoluteUserType,
	PriorityUserType,
} from "@shared/api/shift/request/validations/put";
import React from "react";

const PriorityAndAbsoluteModal = ({
	name,
	mode,
	data,
}: {
	name: string;
	mode: "priority" | "absolute";
	data: AbsoluteUserType[] | PriorityUserType[] | undefined;
}) => {
	return (
		<dialog id={`modal_${name}_${mode}`} className="modal modal-bottom">
			<div className="modal-box">
				<button
					type="submit"
					className="flex w-full justify-center mb-5 -mt-3"
					onClick={() => {
						const modal = document.getElementById(
							`modal_${name}_${mode}`,
						) as HTMLDialogElement | null;
						if (modal) {
							modal.close();
						}
					}}
				>
					<div className="bg-gray02 w-1/4 rounded-full h-1.5" />
				</button>
				<h3 className="font-bold text-lg text-gray02">
					{mode === "priority" ? "優先スタッフ" : "固定スタッフ"}　
					{data ? data.length : 0}名
				</h3>
				<div className="py-4">
					{data?.map((user) => (
						<div key={user.id} className="flex items-center gap-3 mb-2">
							<div className="avatar">
								<div className="w-8 rounded-full">
									<img
										src={user.pictureUrl as string}
										alt={user.name || "User Avatar"}
									/>
								</div>
							</div>
							<span className="text-gray-700">{user.name}</span>
						</div>
					))}
				</div>
			</div>
		</dialog>
	);
};

export default PriorityAndAbsoluteModal;
