import Link from "next/link";
import React from "react";
import { BiArchive } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { MdOutlineArrowOutward } from "react-icons/md";

const ArchiveShiftSection = () => {
	return (
		<section>
			<div className="collapse-title text-black font-bold text-xs text-left flex items-center">
				<BiArchive className="text-lg" />
				<span className="ml-2">アーカイブ</span>
				<Link
					href={"/dashboard/archive"}
					className="flex gap-1 items-center ml-auto border-b-1 border-green02 text-green02"
				>
					<span>移動する</span>
					<BsArrowRight />
				</Link>
			</div>
		</section>
	);
};

export default ArchiveShiftSection;
