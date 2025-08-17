import Header from "@/app/features/dashboard/common/components/Header";
import { liffId } from "@/app/lib/env";
import AuthGate from "@/shared/components/AuthGate";
import AuthProvider from "@/shared/context/AuthProvider";
import FirstView from "../../../shared/components/FirstView";
import FormArea from "./components/form/FormArea";

const Page = () => {
	return (
		<main className="bg-white w-full  h-lvh">
			<div className="bg-white w-full md:w-[410px] mx-auto">
				<FirstView />
				<AuthProvider
					liffId={liffId.registerOwner}
					autoRun={true}
					autoSelectLastStore={false}
				>
					<AuthGate>
						<FormArea />
					</AuthGate>
				</AuthProvider>
			</div>
		</main>
	);
};

export default Page;
