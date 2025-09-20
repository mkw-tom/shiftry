import React from "react";
import Button from "./components/Button";
import FormContent from "./components/FormContent";
import FormHead from "./components/FormHead";
import Table from "./components/Table";
import { AdjustShiftFormContextProvider } from "./context/AdjustShiftFormContextProvider.tsx";

// params 型は Next.js が自動付与するため明示型注釈を削除
export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: shiftReuqestId } = await params;

	return (
		<main className="bg-white w-full min-h-screen">
			<div className="mt-10" />
			<AdjustShiftFormContextProvider>
				<FormContent shiftRequestId={shiftReuqestId} />
				<Button />
			</AdjustShiftFormContextProvider>
		</main>
	);
}
