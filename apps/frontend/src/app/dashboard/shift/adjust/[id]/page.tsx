import React from "react";
import Button from "./components/Button";
import FormContent from "./components/FormContent";
import FormHead from "./components/FormHead";
import Table from "./components/Table";
import { AdjustShiftFormContextProvider } from "./context/AdjustShiftFormContextProvider.tsx";
import { AiAdjustModeProvider } from "./context/AiAdjustModeProvider";
import { ViewSwitchProvider } from "./context/ViewSwitchProvider";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: shiftReuqestId } = await params;

	return (
		<main className="bg-white w-full min-h-screen">
			<ViewSwitchProvider>
				<AiAdjustModeProvider>
					<AdjustShiftFormContextProvider>
						<FormContent shiftRequestId={shiftReuqestId} />
						<Button />
					</AdjustShiftFormContextProvider>
				</AiAdjustModeProvider>
			</ViewSwitchProvider>
		</main>
	);
}
