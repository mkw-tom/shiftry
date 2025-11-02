import React from "react";
import CreateReqeustForm from "./components/CreateReqeustForm";
import FormHead from "./components/shared/FormHead";
import { CreateRequestProvider } from "./context/CreateRequestFormProvider";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: shiftRequestId } = await params;

	return (
		<CreateRequestProvider>
			<main className="bg-white w-full h-lvh">
				<div className="w-full h-auto">
					<FormHead />
					<CreateReqeustForm shiftRequestId={shiftRequestId} />
				</div>
			</main>
		</CreateRequestProvider>
	);
}
