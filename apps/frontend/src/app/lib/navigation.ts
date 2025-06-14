import { useRouter } from "next/navigation";
import type { StateRole } from "./types/line-auth";

export const useNavigation = () => {
	const router = useRouter();

	const navigateAfterLineAuth = (role: StateRole) => {
		if (role === "STAFF") {
			router.push("/register/owner");
		} else {
			router.push("/register/owner");
		}
	};

	const navigateLogin = () => router.push("/auth/login");

	const navigateToFail = () => router.push("/auth/fail");

	const navigateToInvite = () => router.push("/register/connect");
	const navigateDashboard = () => router.push("/dashboard");

	const navigateRegisterPayment = () => router.push("/register/payment");

	return {
		navigateAfterLineAuth,
		navigateToFail,
		navigateToInvite,
		navigateDashboard,
		navigateRegisterPayment,
		navigateLogin,
	};
};
