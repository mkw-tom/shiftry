import { FiMenu } from "react-icons/fi";
import CancelSection from "./CancelSection";
import PaymentSectioin from "./PaymentSectioin";
import StoresSection from "./StoresSection";
import UserSection from "./UserSection";

const Sideber = () => {
	return (
		<div className="drawer drawer-end z-40">
			<input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content">
				<label htmlFor="my-drawer-4" className="drawer-button">
					<FiMenu className="text-lg text-white" />
				</label>
			</div>
			<div className="drawer-side">
				<label
					htmlFor="my-drawer-4"
					className="drawer-overlay"
					aria-label="close sidebar"
				/>
				<ul className="menu bg-base text-base-content min-h-full w-72 p-4 scroll-auto">
					<UserSection />
					<PaymentSectioin />
					<StoresSection />
					<CancelSection />
				</ul>
			</div>
		</div>
	);
};

export default Sideber;
