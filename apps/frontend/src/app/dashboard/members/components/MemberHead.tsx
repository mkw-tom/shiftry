import type React from "react";

const MemberHead = ({
	membersFilter,
	setMembersFilter,
}: {
	membersFilter: "all" | "registed" | "notRegist";
	setMembersFilter: React.Dispatch<
		React.SetStateAction<"all" | "registed" | "notRegist">
	>;
}) => {
	return (
		<div className="w-full h-auto mx-auto bg-white rounded-b-md -mt-1 pt-4">
			<div className="w-full h-full flex flex-col  transition-all duration-300">
				<div className="w-full h-full flex items-center px-1 text-sm bg-white -mt-1 rounded-b-md ">
					<button
						type="button"
						className={`${
							membersFilter === "all" ? "font-bold" : "opacity-60"
						} text-center w-1/3 text-green02 pb-1`}
						onClick={() => setMembersFilter("all")}
					>
						全員
					</button>
					<button
						type="button"
						className={`${
							membersFilter === "registed" ? "font-bold" : " opacity-60"
						} text-center w-1/3 text-green02 pb-1`}
						onClick={() => setMembersFilter("registed")}
					>
						登録済み
					</button>
					<button
						type="button"
						className={`${
							membersFilter === "notRegist" ? "font-bold" : " opacity-60"
						} text-center w-1/3 text-green02 pb-1`}
						onClick={() => setMembersFilter("notRegist")}
					>
						未登録
					</button>
				</div>
				<div className="w-full mx-auto px-2 overflow-hidden">
					<div
						className={`flex items-center w-[33.333%] h-1 transition-transform duration-300 ease-in-out 
      ${
				membersFilter === "all"
					? "translate-x-[0%]"
					: membersFilter === "registed"
						? "translate-x-[100%]"
						: membersFilter === "notRegist"
							? "translate-x-[200%]"
							: ""
			}
    `}
					>
						<div className="w-full h-1.5 rounded-t-full bg-green02 opacity-80" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default MemberHead;
