import Link from "next/link";
import React from "react";
import { BiArchive } from "react-icons/bi";

const ArchiveShiftSection = () => {
	return (
		<section>
			<Link
				href={"/dashboard/archive"}
				className="collapse-title text-black font-bold text-xs text-left flex items-center"
			>
				<BiArchive className="text-lg" />
				<span className="ml-2">アーカイブ</span>
			</Link>
		</section>
	);
};

export default ArchiveShiftSection;
