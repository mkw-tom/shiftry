"use client";
import type { AutoModifiedType } from "@shared/api/shift/adjust/types/auto";
import {
	type ReactNode,
	createContext,
	useContext,
	useMemo,
	useState,
} from "react";

type autoAdjustModeContextType = {
	autoMode: boolean;
	setAutoMode: React.Dispatch<React.SetStateAction<boolean>>;
	autoModified: AutoModifiedType;
	startAutoAdjustMode: (modified: AutoModifiedType) => void;
	allowModified: (date: string, time: string) => boolean;
	rejectModified: (date: string, time: string) => void;
	allowModifiedDatas: AutoModifiedType;
	rejectModifiedDatas: AutoModifiedType;
	validate: boolean;
	clearStates: () => void;
};

export const autoAdjustModeContext = createContext<
	autoAdjustModeContextType | undefined
>(undefined);

export const useAutoAdjustMode = () => {
	const context = useContext(autoAdjustModeContext);
	if (context === undefined) {
		throw new Error("useAiAdjust must be used within a AiAdjustProvider");
	}
	return context;
};

export const AutoAdjustModeProvider = ({
	children,
}: { children: ReactNode }) => {
	const [autoMode, setAutoMode] = useState(false);
	const [autoModified, setAutoModified] = useState<AutoModifiedType>({});
	const [allowModifiedDatas, setAllowModifiedDatas] =
		useState<AutoModifiedType>({});
	const [rejectModifiedDatas, setRejectModifiedDatas] =
		useState<AutoModifiedType>({});

	const validate = useMemo(() => {
		// AiModifiedの全date/timeがallow/rejectどちらかに入っているか
		let total = 0;
		let checked = 0;
		for (const [date, times] of Object.entries(autoModified)) {
			for (const time of Object.keys(times)) {
				total++;
				if (
					allowModifiedDatas[date]?.[time] !== undefined ||
					rejectModifiedDatas[date]?.[time] !== undefined
				) {
					checked++;
				}
			}
		}
		return total > 0 && total === checked;
	}, [autoModified, allowModifiedDatas, rejectModifiedDatas]);

	const startAutoAdjustMode = (modified: AutoModifiedType) => {
		setAutoMode(true);
		setAutoModified(modified);
		setAllowModifiedDatas(modified);
	};

	const allowModified = (date: string, time: string) => {
		if (rejectModifiedDatas[date]?.[time]) {
			setRejectModifiedDatas((prev) => {
				const newState = { ...prev };
				if (newState[date]) {
					const dateObj = { ...newState[date] };
					delete dateObj[time];
					if (Object.keys(dateObj).length === 0) {
						delete newState[date];
					} else {
						newState[date] = dateObj;
					}
				}
				return newState;
			});
		}
		setAllowModifiedDatas((prev) => {
			const newState = { ...prev };
			const dateObj = { ...(newState[date] || {}) };
			if (
				autoModified[date]?.[time] !== undefined &&
				autoModified[date]?.[time] !== null
			) {
				dateObj[time] = autoModified[date][time];
			}
			newState[date] = dateObj;
			return newState;
		});
		return true;
	};

	const rejectModified = (date: string, time: string) => {
		if (allowModifiedDatas[date]?.[time]) {
			setAllowModifiedDatas((prev) => {
				const newState = { ...prev };
				if (newState[date]) {
					const dateObj = { ...newState[date] };
					delete dateObj[time];
					if (Object.keys(dateObj).length === 0) {
						delete newState[date];
					} else {
						newState[date] = dateObj;
					}
				}
				return newState;
			});
		}
		setRejectModifiedDatas((prev) => {
			const newState = { ...prev };
			const dateObj = { ...(newState[date] || {}) };
			if (autoModified[date]?.[time] !== undefined) {
				dateObj[time] = autoModified[date][time];
			}
			newState[date] = dateObj;
			return newState;
		});
		return true;
	};

	const clearStates = () => {
		setAutoModified({});
		setAllowModifiedDatas({});
		setRejectModifiedDatas({});
	};

	return (
		<autoAdjustModeContext.Provider
			value={{
				autoMode,
				setAutoMode,
				autoModified,
				startAutoAdjustMode,
				allowModified,
				rejectModified,
				allowModifiedDatas,
				rejectModifiedDatas,
				validate,
				clearStates,
			}}
		>
			{children}
		</autoAdjustModeContext.Provider>
	);
};
