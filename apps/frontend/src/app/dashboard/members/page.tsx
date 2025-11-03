import MembersContent from "@/app/dashboard/members/components/MembersContent";
import FooterNav from "../common/components/FooterNav";

const Page = () => {
	return (
		<main className="bg-white w-full h-lvh">
			<div className="w-full h-full ">
				<MembersContent />
				<FooterNav />
			</div>
		</main>
	);
};

export default Page;
