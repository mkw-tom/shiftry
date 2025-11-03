import FooterNav from "../common/components/FooterNav";
import SubmitStatusList from "./components/SubmitStatusList";

const Page = () => {
	return (
		<main className="bg-white w-full h-lvh">
			<div className="w-full h-full ">
				<SubmitStatusList />
				<FooterNav />
			</div>
		</main>
	);
};

export default Page;
