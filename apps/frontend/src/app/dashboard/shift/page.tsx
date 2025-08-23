import AuthGate from "@/shared/components/AuthGate";
import { liffId } from "../../lib/env";
import HomeContent from "./components/HomeContent";

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
