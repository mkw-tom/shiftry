import { liffId } from "@/app/lib/env";
// import StaffRegisterContent from "@/app/features/register/staff/components/StaffRegisterContent";
import InitGate from "@/shared/components/InitGate";
import FirstView from "../../../shared/components/FirstView";
import RegisterStaffForm from "./components/ConnectForm";

const Page = () => {
	return (
		<main className="bg-white w-full h-lvh">
			<div className="w-full md:w-[410px] mx-auto">
				<FirstView />
				{/* <InitGate liffId={liffId.registerStaff}> */}
				<RegisterStaffForm />
				{/* </InitGate> */}

				{/* <Suspense
				{/* <AuthGate liffId={liffId.registerStaff}> */}
				{/* <InitGate liffId={liffId.registerStaff}> */}
				{/* <Suspense
					fallback={
						<div className="w-1/2 mx-auto mt-10">
							<div className="loading loading-spinner" />
						</div>
					}
				{/* <StaffRegisterContent /> */}
			</div>
		</main>
	);
};

export default Page;
