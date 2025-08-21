import { liffId } from "@/app/lib/env";
import AuthGate from "@/shared/components/AuthGate";
import FirstView from "@/shared/components/FirstView";
import InitGate from "@/shared/components/InitGate";
import AuthProvider from "@/shared/context/AuthProvider";
import React, { Suspense } from "react";
import ConnectForm from "./components/ConnectForm";

const Page = () => {
	return (
		<main className="bg-white w-full h-lvh">
			<div className="w-full md:w-[410px] mx-auto">
				<FirstView />
				{/* <AuthGate liffId={liffId.registerConnect}> */}
				{/* <InitGate liffId={liffId.registerConnect}> */}
				<Suspense
					fallback={
						<div className="w-1/2 mx-auto mt-10">
							<div className="loading loading-spinner" />
						</div>
					}
				>
					<ConnectForm />
				</Suspense>
				{/* </InitGate> */}
				{/* </AuthGate> */}
			</div>
		</main>
	);
};

export default Page;
