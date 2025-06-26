import React, { useState } from "react";
import MembersList from "./MembersList";
import SearchBar from "./SearchBar";

const MembersContent = () => {
	const [membersFilter, setMembersFilter] = useState<
		"all" | "registed" | "notRegist"
	>("all");
	return (
		<div className="w-full h-auto mx-auto">
			<SearchBar
				membersFilter={membersFilter}
				setMembersFilter={setMembersFilter}
			/>

			<MembersList membersFilter={membersFilter} />
		</div>
	);
};

export default MembersContent;
