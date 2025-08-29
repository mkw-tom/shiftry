"use client";
import type { ShiftsOfRequestsType } from "@shared/api/common/types/json";
import type { ShiftRequestWithJson } from "@shared/api/common/types/merged";
import type { ShiftRequest } from "@shared/api/common/types/prisma";
import {
	Dispatch,
	type ReactNode,
	createContext,
	useContext,
	useState,
} from "react";
// import { useCreateRequest } from "./useCreateRequest";

export enum DrawerView {
	CREATE_REQUEST = "CREATE_REQUEST", // シフト依頼作成
	SUBMIT = "SUBMIT", // 提出
	STATUS = "STATUS", // 提出状況確認 & 回収作成
	ADJUSTMENT = "ADJUSTMENT", // 調整
	CONFIRM = "CONFIRM", // 出来上がり確認
	GENERATE = "GENERATE",
}

type bottomDrawerContextType = {
	isOpen: boolean;
	darawerOpen: (status: DrawerView, data: ShiftRequestWithJson | null) => void;
	drawerClose: () => void;
	view: DrawerView | undefined;
	currentData: ShiftRequestWithJson | null;
};

export const bottomDrawerContext = createContext<
	bottomDrawerContextType | undefined
>(undefined);

export const useBottomDrawer = () => {
	const context = useContext(bottomDrawerContext);
	if (context === undefined) {
		throw new Error(
			"useBottomDarawer must be used within a BottomDrawerProvider",
		);
	}
	return context;
};

export const BottomDrawerProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOepn] = useState<boolean>(false);
	const [view, setView] = useState<DrawerView>();
	const [currentData, setCurrentData] = useState<ShiftRequestWithJson | null>(
		null,
	);

	function darawerOpen(status: DrawerView, data: ShiftRequestWithJson | null) {
		setIsOepn(true);
		setView(status);
		setCurrentData(data);
	}

	function drawerClose() {
		setIsOepn(false);
	}
	return (
		<bottomDrawerContext.Provider
			value={{ isOpen, darawerOpen, drawerClose, view, currentData }}
		>
			{children}
		</bottomDrawerContext.Provider>
	);
};
