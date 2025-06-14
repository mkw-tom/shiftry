import HomeContent from "../features/dashboard/index/components/HomeContent";
import Head from "../features/dashboard/index/components/head/Head";

const Page = () => {
	return (
		<main className="bg-base w-full h-lvh">
			<div className="w-full h-full pt-4">
				<Head />
				<HomeContent />
			</div>
		</main>
	);
};

export default Page;
