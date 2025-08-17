import LoginFormArea from "@/app/features/auth/login/components/LoginFormArea";
import FirstView from "@/shared/components/FirstView";

const Page = () => {
	return (
		<main className="bg-green01 w-full  h-lvh">
			<div className="bg-green01 w-full md:w-[400px] mx-auto">
				<FirstView />

				<LoginFormArea />
			</div>
		</main>
	);
};

export default Page;
