import type { ReactNode } from "react";
import Head from "../features/dashboard/common/components/Head";
import Header from "../features/dashboard/common/components/Header";
import BottomDrawer from "../features/dashboard/common/components/bottomDrawer/BottomDrawer";
import { ToastProvider } from "../features/dashboard/common/context/ToastProvider";
import { BottomDrawerProvider } from "../features/dashboard/common/context/useBottomDrawer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<ToastProvider>
				<BottomDrawerProvider>
					<Header />
					{children}
					<BottomDrawer />
				</BottomDrawerProvider>
			</ToastProvider>
		</>
	);
}
