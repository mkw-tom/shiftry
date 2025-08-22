import { liffId } from "@/app/lib/env";
import InitGate from "@/shared/components/InitGate";
import FirstView from "../../../shared/components/FirstView";
import RegisterForm from "./components/RegisterForm";

const Page = () => {
	return (
		<main className="bg-white w-full h-lvh">
			<div className="bg-white w-full md:w-[410px] mx-auto">
				<FirstView />
				<InitGate
					liffId={liffId.registerOwner}
					autoLogin={true}
					requireLiffContext={true}
				>
					<RegisterForm />
				</InitGate>
			</div>
		</main>
	);
};

export default Page;
