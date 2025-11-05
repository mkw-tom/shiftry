import type React from "react";
import PageBackButton from "../../common/components/PageBackButton";

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
		<div className="flex items-center gap-3 py-3 px-3 border-b border-gray01">
			<span className="text-green02 font-bold w-full text-center text-sm">
				スタッフ一覧
			</span>
		</div>
	);
};

export default MemberHead;
