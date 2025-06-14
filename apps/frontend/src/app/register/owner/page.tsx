import FirstView from "../../features/common/components/FirstView";
import FormArea from "../../features/register/owner/components/form/FormArea";

const Page = () => {
	return (
		<main className="bg-green01 w-full  h-lvh">
			<div className="bg-green01 w-full md:w-[400px] mx-auto">
				<FirstView />
				<FormArea />
			</div>
		</main>
	);
};

export default Page;
