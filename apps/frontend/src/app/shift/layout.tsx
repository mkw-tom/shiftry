import AuthGate from "@/shared/components/AuthGate";
import type { ReactNode } from "react";
import { liffId } from "../../lib/env";
import FooterNav from "../dashboard/common/components/FooterNav";
import Header from "../dashboard/common/components/Header";
import BottomDrawer from "../dashboard/common/components/bottomDrawer/BottomDrawer";
import { ToastProvider } from "../dashboard/common/context/ToastProvider";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<ToastProvider>
				<Header />
				{children}
			</ToastProvider>
		</>
	);
}
