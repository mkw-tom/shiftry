import { liffId } from "@/lib/env";
import AuthGate from "@/shared/components/AuthGate";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import React from "react";
import Button from "./components/Button";
import FormContent from "./components/FormContent";
import { AdjustShiftFormContextProvider } from "./context/AdjustShiftFormContextProvider.tsx";
import { ViewSwitchProvider } from "./context/ViewSwitchProvider";

const page = () => {
	return (
		<main className="bg-white w-full min-h-screen">
			<div className="mt-10" />
			<AuthGate liffId={liffId.shiftShow}>
				<Suspense
					fallback={
						<div className="w-1/2 mx-auto mt-10">
							<div className="loading loading-spinner" />
						</div>
					}
				>
					<ViewSwitchProvider>
						<AdjustShiftFormContextProvider>
							<FormContent />
							<Button />
						</AdjustShiftFormContextProvider>
					</ViewSwitchProvider>
				</Suspense>
			</AuthGate>
		</main>
	);
};

export default page;
