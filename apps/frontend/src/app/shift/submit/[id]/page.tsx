import { API_URL, liffId } from "@/lib/env";
import AuthGate from "@/shared/components/AuthGate";
import FetchData from "../components/FetchData";
import FormHead from "../components/FormHead";
import SubmitForm from "../components/SubmitForm";
import { SubmitShiftFormContextProvider } from "../context/SubmitShiftFormContextProvider";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function ShiftPage({ params }: Props) {
	const { id } = await params;
	return (
		<main className="bg-white w-full h-lvh">
			<div className="w-full h-auto pt-10 ">
				<AuthGate liffId={liffId.shiftSubmit}>
					<SubmitShiftFormContextProvider>
						<FetchData shiftRequestId={id} />
						<FormHead />
						<SubmitForm />
					</SubmitShiftFormContextProvider>
				</AuthGate>
				/
			</div>
		</main>
	);
}
