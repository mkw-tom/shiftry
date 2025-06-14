import React from "react";
import MembersList from "./MembersList";
import SearchBar from "./SearchBar";

const MembersContent = () => {
	return (
		<div className="w-full h-full">
			<SearchBar />
			<MembersList />
		</div>
	);
};

export default MembersContent;
