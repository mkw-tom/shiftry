import type { ReactNode } from "react";
import Header from "../features/dashboard/common/components/Header";
import BottomDrawer from "../features/dashboard/common/components/bottomDrawer/BottomDrawer";
import { BottomDrawerProvider } from "../features/dashboard/common/context/useBottomDrawer";
import Head from "../features/dashboard/index/components/head/Head";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<BottomDrawerProvider>
				<Header />
				{children}
				<BottomDrawer />
			</BottomDrawerProvider>
		</>
	);
}
