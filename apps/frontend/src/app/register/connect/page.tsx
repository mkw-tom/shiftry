import { liffId } from "@/app/lib/env";
import AuthGate from "@/shared/components/AuthGate";
import FirstView from "@/shared/components/FirstView";
import AuthProvider from "@/shared/context/AuthProvider";
import React from "react";
import ConnectForm from "./components/ConnectForm";
import FormContent from "./components/FormContent";
import UnconnectedStoreList from "./components/UnconnectedStoreList";

const Page = () => {
	return (
		<main className="bg-white w-full h-lvh">
			<div className="w-full md:w-[410px] mx-auto">
				<AuthProvider liffId={liffId.registerConnect} autoRun={true}>
					<AuthGate>
						<FirstView />
						<FormContent />
					</AuthGate>
				</AuthProvider>
			</div>
		</main>
	);
};

export default Page;
