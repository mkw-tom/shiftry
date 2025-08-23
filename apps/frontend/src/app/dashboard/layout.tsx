import AuthGate from "@/shared/components/AuthGate";
import type { ReactNode } from "react";
import { liffId } from "../lib/env";
import Header from "./common/components/Header";
import BottomDrawer from "./common/components/bottomDrawer/BottomDrawer";
import { ToastProvider } from "./common/context/ToastProvider";
import { BottomDrawerProvider } from "./common/context/useBottomDrawer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<AuthGate liffId={liffId.dashboard}>
				<ToastProvider>
					<BottomDrawerProvider>
						<Header />
						{children}
						<BottomDrawer />
					</BottomDrawerProvider>
				</ToastProvider>
			</AuthGate>
		</>
	);
}
