import Header from "../common/components/Header";
import ShiftRequestList from "./components/ShiftRequestList";

const Page = () => {
	return (
		<main className="bg-white w-full h-lvh">
			<div className="w-full h-full ">
				<Header />
				<ShiftRequestList />
			</div>
		</main>
	);
};

export default Page;
