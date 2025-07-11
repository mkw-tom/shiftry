import React from "react";
import Head from "../../common/components/Head";

const ArchivePageContent = () => {
	return (
		<div className="w-full h-full">
			<div className="w-full h-auto pt-10 bg-green02 shadow-2xl ">
				<Head />
			</div>
			<main className="bg-white w-full h-lvh pt-12">
				<div className="w-full h-full pt-4 flex flex-col items-center gap-5">
					<p className="text-black">アーカイブページです</p>
				</div>
			</main>
		</div>
	);
};

export default ArchivePageContent;
