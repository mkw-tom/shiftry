"use client";
import { ShiftsOfAssignType } from "@shared/api/common/types/json";
import type { AiModifiedType } from "@shared/api/shift/ai/types/post-adjust";
import {
	type ReactNode,
	createContext,
	useContext,
	useMemo,
	useState,
} from "react";

type AiAdjustModeContextType = {
	aiMode: boolean;
	setAiMode: React.Dispatch<React.SetStateAction<boolean>>;
	AiModified: AiModifiedType;
	startAiAdjustMode: (modified: AiModifiedType) => void;
	allowModified: (date: string, time: string) => boolean;
	rejectModified: (date: string, time: string) => void;
	allowModifiedDatas: AiModifiedType;
	rejectModifiedDatas: AiModifiedType;
	validate: boolean;
	clearStates: () => void;
};

export const aiAdjustModeContext = createContext<
	AiAdjustModeContextType | undefined
>(undefined);

export const useAiAdjustMode = () => {
	const context = useContext(aiAdjustModeContext);
	if (context === undefined) {
		throw new Error("useAiAdjust must be used within a AiAdjustProvider");
	}
	return context;
};

export const AiAdjustModeProvider = ({ children }: { children: ReactNode }) => {
	const [aiMode, setAiMode] = useState(false);
	const [AiModified, setAiModified] = useState<AiModifiedType>({});
	const [allowModifiedDatas, setAllowModifiedDatas] = useState<AiModifiedType>(
		{},
	);
	const [rejectModifiedDatas, setRejectModifiedDatas] =
		useState<AiModifiedType>({});

	const validate = useMemo(() => {
		// AiModifiedの全date/timeがallow/rejectどちらかに入っているか
		let total = 0;
		let checked = 0;
		for (const [date, times] of Object.entries(AiModified)) {
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
	}, [AiModified, allowModifiedDatas, rejectModifiedDatas]);

	const startAiAdjustMode = (modified: AiModifiedType) => {
		setAiMode(true);
		setAiModified(modified);
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
				AiModified[date]?.[time] !== undefined &&
				AiModified[date]?.[time] !== null
			) {
				dateObj[time] = AiModified[date][time];
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
			if (AiModified[date]?.[time] !== undefined) {
				dateObj[time] = AiModified[date][time];
			}
			newState[date] = dateObj;
			return newState;
		});
		return true;
	};

	const clearStates = () => {
		setAiModified({});
		setAllowModifiedDatas({});
		setRejectModifiedDatas({});
	};

	return (
		<aiAdjustModeContext.Provider
			value={{
				aiMode,
				setAiMode,
				AiModified,
				startAiAdjustMode,
				allowModified,
				rejectModified,
				allowModifiedDatas,
				rejectModifiedDatas,
				validate,
				clearStates,
			}}
		>
			{children}
		</aiAdjustModeContext.Provider>
	);
};
