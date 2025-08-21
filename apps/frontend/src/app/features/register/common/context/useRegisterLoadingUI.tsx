// "use client";
// import type { RootState } from "@/app/redux/store";
// import {
// 	type Dispatch,
// 	type ReactNode,
// 	type SetStateAction,
// 	createContext,
// 	useContext,
// 	useEffect,
// 	useState,
// } from "react";
// import { useSelector } from "react-redux";

// export type RegisterLoadingUIContextType = {
// 	pageLoading: boolean;
// 	setPageLoading: Dispatch<SetStateAction<boolean>>;
// 	apiLoading: boolean;
// 	setApiLoading: Dispatch<SetStateAction<boolean>>;
// };

// const RegisterLoadingUIContext = createContext<
// 	RegisterLoadingUIContextType | undefined
// >(undefined);

// export const useRegisterLoadingUI = () => {
// 	const context = useContext(RegisterLoadingUIContext);
// 	if (context === undefined) {
// 		throw new Error("useIsRegister must be used within a IsRegisterProvider");
// 	}
// 	return context;
// };

// export const RegisterLoadingUIProvider = ({
// 	children,
// }: {
// 	children: ReactNode;
// }) => {
// 	const token = useSelector((state: RootState) => state.token);

// 	const [pageLoading, setPageLoading] = useState<boolean>(true);
// 	const [apiLoading, setApiLoading] = useState<boolean>(false);
// 	useEffect(() => {
// 		if (
// 			typeof token.userToken !== "undefined" &&
// 			typeof token.storeToken !== "undefined"
// 		) {
// 			setPageLoading(false);
// 		}
// 	}, [token.userToken, token.storeToken]);

// 	const value = {
// 		pageLoading,
// 		setPageLoading,
// 		apiLoading,
// 		setApiLoading,
// 	};

// 	return (
// 		<RegisterLoadingUIContext.Provider value={value}>
// 			{children}
// 		</RegisterLoadingUIContext.Provider>
// 	);
// };
