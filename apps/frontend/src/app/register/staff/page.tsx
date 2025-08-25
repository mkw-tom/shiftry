import { liffId } from "@/lib/env";
import InitGate from "@/shared/components/InitGate";
import FirstView from "../../../shared/components/FirstView";
import RegisterStaffForm from "./components/ConnectForm";

const Page = () => {
	return (
		<main className="bg-white w-full h-lvh">
			<div className="w-full md:w-[410px] mx-auto">
				<FirstView />
				<InitGate liffId={liffId.registerStaff}>
					<RegisterStaffForm />
				</InitGate>
			</div>
		</main>
	);
};

export default Page;
