import { liffId } from "@/lib/env";
import AuthGate from "@/shared/components/AuthGate";
import { Suspense } from "react";
import FetchData from "./components/FetchData";
import FormHead from "./components/FormHead";
import SubmitForm from "./components/SubmitForm";
import { SubmitShiftFormContextProvider } from "./context/SubmitShiftFormContextProvider";

export default async function ShiftPage() {
	return (
		<main className="bg-white w-full h-lvh">
			<div className="w-full h-auto pt-10 ">
				<AuthGate liffId={liffId.shiftSubmit}>
					<Suspense
						fallback={
							<div className="w-1/2 mx-auto mt-10">
								<div className="loading loading-spinner" />
							</div>
						}
					>
						<SubmitShiftFormContextProvider>
							<FetchData />
							<FormHead />
							<SubmitForm />
						</SubmitShiftFormContextProvider>
					</Suspense>
				</AuthGate>
			</div>
		</main>
	);
}
