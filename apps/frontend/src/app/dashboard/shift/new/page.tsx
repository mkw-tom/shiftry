import React from "react";
import Head from "../../home/components/Head";
import CreateReqeustForm from "./components/CreateReqeustForm";
import FormHead from "./components/FormHead";
import { CreateRequestProvider } from "./context/useCreateRequest";

const Page = () => {
	return (
		<CreateRequestProvider>
			<main className="bg-white w-full h-lvh">
				<div className="w-full h-auto pt-10 ">
					<FormHead />
					<CreateReqeustForm />
				</div>
			</main>
		</CreateRequestProvider>
	);
};

export default Page;
