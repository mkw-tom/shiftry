import Button from "@/app/dashboard/shift/adjust/[id]/components/Button";
import { AdjustShiftFormContextProvider } from "@/app/dashboard/shift/adjust/[id]/context/AdjustShiftFormContextProvider.tsx";
import { ViewSwitchProvider } from "@/app/dashboard/shift/adjust/[id]/context/ViewSwitchProvider";
import { liffId } from "@/lib/env";
import AuthGate from "@/shared/components/AuthGate";
import { Suspense } from "react";
import React from "react";
import FormContent from "./FormContent";

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
