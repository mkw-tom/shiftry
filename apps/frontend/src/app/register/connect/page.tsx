import FirstView from "@/app/features/common/components/FirstView";
import ConnectModalArea from "@/app/features/register/connect/components/ConnectModalArea";
import React from "react";

const Page = () => {
	return (
		<main className="bg-green01 w-full  h-lvh">
			<div className="bg-green01 w-full md:w-[400px] mx-auto">
				<FirstView />
				<ConnectModalArea />
			</div>
		</main>
	);
};

export default Page;
