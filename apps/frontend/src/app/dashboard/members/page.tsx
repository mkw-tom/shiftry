import Head from "@/app/dashboard/common/components/Head";
import MembersContent from "@/app/dashboard/members/components/MembersContent";

const Page = () => {
	return (
		<main className="bg-white w-full h-lvh">
			<div className="w-full h-full ">
				<MembersContent />
			</div>
		</main>
	);
};

export default Page;
