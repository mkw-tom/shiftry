import type { ReactNode } from "react";
import Head from "./common/components/Head";
import Header from "./common/components/Header";
import BottomDrawer from "./common/components/bottomDrawer/BottomDrawer";
import { ToastProvider } from "./common/context/ToastProvider";
import { BottomDrawerProvider } from "./common/context/useBottomDrawer";

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
