"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import Head from "../../index/components/head/Head";
import MemberHead from "./MemberHead";
import MembersList from "./MembersList";
import SearchBar from "./SearchBar";

const MembersContent = () => {
	const [membersFilter, setMembersFilter] = useState<
		"all" | "registed" | "notRegist"
	>("all");
	return (
		<div className="w-full h-full">
			<div className="w-full h-auto bg-green02 shadow-2xl pt-10">
				<Head />
				<MemberHead
					membersFilter={membersFilter}
					setMembersFilter={setMembersFilter}
				/>
			</div>
			<div className="w-full h-auto mx-auto">
				<SearchBar
					membersFilter={membersFilter}
					setMembersFilter={setMembersFilter}
				/>

				<MembersList membersFilter={membersFilter} />
			</div>
		</div>
	);
};

export default MembersContent;
