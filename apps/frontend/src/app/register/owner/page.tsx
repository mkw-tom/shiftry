import Header from "@/app/features/dashboard/common/components/Header";
import { liffId } from "@/app/lib/env";
import AuthGate from "@/shared/components/AuthGate";
import InitGate from "@/shared/components/InitGate";
import AuthProvider from "@/shared/context/AuthProvider";
import { useLiffInit } from "@/shared/hooks/useLIffInit";
import liff from "@line/liff";
import { MdErrorOutline } from "react-icons/md";
import FirstView from "../../../shared/components/FirstView";
import RegisterForm from "./components/form/RegisterForm";

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
