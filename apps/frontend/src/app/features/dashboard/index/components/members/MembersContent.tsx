import React, { useState } from "react";
import MembersList from "./MembersList";
import SearchBar from "./SearchBar";

const MembersContent = () => {
	const [membersFilter, setMembersFilter] = useState<
		"all" | "registed" | "notRegist"
	>("all");
	return (
		<div className="w-11/12 h-auto mx-auto mt-10 bg-white shadow-md rounded-sm">
			<SearchBar
				membersFilter={membersFilter}
				setMembersFilter={setMembersFilter}
			/>

			<MembersList membersFilter={membersFilter} />
		</div>
	);
};

export default MembersContent;
