import AuthGate from "@/shared/components/AuthGate";
import HomeContent from "../features/dashboard/index/components/HomeContent";
import { liffId } from "../lib/env";

const Page = () => {
	return (
		<main className="bg-white w-full h-lvh">
			<div className="w-full h-full ">
				<AuthGate liffId={liffId.dashboard}>
					<HomeContent />
				</AuthGate>
			</div>
		</main>
	);
};

export default Page;
