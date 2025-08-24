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
      <ToastProvider>
        <BottomDrawerProvider>
          <Header />
          <AuthGate liffId={liffId.dashboard}>{children}</AuthGate>
          <BottomDrawer />
        </BottomDrawerProvider>
      </ToastProvider>
    </>
  );
}
