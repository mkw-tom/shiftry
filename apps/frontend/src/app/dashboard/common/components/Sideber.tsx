import { FiMenu } from "react-icons/fi";
import CancelSection from "./sidebarSections/CancelSection";
import MemberListSection from "./sidebarSections/MemberListSection";
// import PaymentSectioin from "./sidebarSections/PaymentSectioin";
import StoresSection from "./sidebarSections/StoresSection";
import UserSection from "./sidebarSections/UserSection";

const Sideber = () => {
	return (
		<div className="drawer drawer-end z-40 ">
			<input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content">
				<label htmlFor="my-drawer-4" className="drawer-button lg:hidden ">
					<FiMenu className="text-xl lg:text-2xl text-green02 m-2 mr-4" />
				</label>
			</div>
			<div className="drawer-side ">
				<label
					htmlFor="my-drawer-4"
					className="drawer-overlay"
					aria-label="close sidebar"
				/>
				<ul className="menu bg-base lg:bg-white  text-base-content min-h-full w-72 p-4 scroll-auto border-t-[6px] border-green02 ">
					<UserSection />
					<MemberListSection />
					{/* <PaymentSectioin /> */}
					<StoresSection />
					<CancelSection />
				</ul>
			</div>
		</div>
	);
};

export default Sideber;
