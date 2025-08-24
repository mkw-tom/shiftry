"use client";
import React from "react";
import Head from "../../home/components/Head";
import CreateReqeustForm from "./components/CreateReqeustForm";
import { CreateRequestProvider } from "./context/useCreateRequest";

const Page = () => {
	return (
		<CreateRequestProvider>
			<main className="bg-white w-full h-lvh">
				<div className="w-full h-auto pt-10 ">
					<h2 className="text-green02 font-bold text-sm text-center w-full pt-5 border-b border-gray01 pb-2">
						{"シフト提出依頼の作成"}
					</h2>
					<CreateReqeustForm />
				</div>
			</main>
		</CreateRequestProvider>
	);
};

export default Page;
