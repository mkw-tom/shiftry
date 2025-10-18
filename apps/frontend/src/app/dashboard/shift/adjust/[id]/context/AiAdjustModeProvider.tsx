"use client";
import { ShiftsOfAssignType } from "@shared/api/common/types/json";
import type { AssignUserType } from "@shared/api/shift/assign/validations/put";
import {
	type ReactNode,
	createContext,
	useContext,
	useMemo,
	useState,
} from "react";

// Define AiModifiedType based on your usage
export type AiModifiedType = {
	[date: string]: {
		[time: string]: {
			name: string;
			count: number;
			jobRoles: string[];
			assigned: AssignUserType[];
			assignedCount: number;
			vacancies: number;
			status: string;
			updatedAt: string;
			updatedBy: string;
		} | null;
	};
};

type AiAdjustModeContextType = {
	aiMode: boolean;
	setAiMode: React.Dispatch<React.SetStateAction<boolean>>;
	AiModified: AiModifiedType;
	useAiAssign: (modified: AiModifiedType) => void;
	allowModified: (date: string, time: string) => boolean;
	rejectModified: (date: string, time: string) => void;
	isAiLoading: boolean;
	aiError: string | null;
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
	const [isAiLoading, setIsAiLoading] = useState(false);
	const [aiError, setAiError] = useState<string | null>(null);
	const [AiModified, setAiModified] = useState<AiModifiedType>({});
	const [allowModifiedDatas, setAllowModifiedDatas] = useState<AiModifiedType>(
		{},
	);
	const [rejectModifiedDatas, setRejectModifiedDatas] =
		useState<AiModifiedType>({});

	const validate =
		Object.entries(AiModified).length ===
		Object.entries(allowModifiedDatas).length +
			Object.entries(rejectModifiedDatas).length;

	const useAiAssign = (modified: AiModifiedType) => {
		setIsAiLoading(true);
		setAiError(null);
		setTimeout(() => {
			// ここでAPI呼び出しなどの非同期処理を行う
			// 成功した場合
			setAiError(null);
			setIsAiLoading(false);
			setAiMode(true);
			setAiModified(modified);
		}, 2000); // 2秒後に完了とする例
		// 失敗した場合
		// setAiError("エラーメッセージ");
		// setIsAiLoading(false);
	};

	const allowModified = (date: string, time: string) => {
		if (rejectModifiedDatas[date]?.[time]) {
			setRejectModifiedDatas((prev) => {
				const newState = { ...prev };
				if (!newState[date]) {
					newState[date] = {};
				}
				newState[date][time] = null;
				return newState;
			});
		}
		setAllowModifiedDatas((prev) => {
			const newState = { ...prev };
			if (!newState[date]) {
				newState[date] = {};
			}
			newState[date][time] = AiModified[date] ? AiModified[date]?.[time] : null;
			return newState;
		});
		return true;
	};

	const rejectModified = (date: string, time: string) => {
		if (allowModifiedDatas[date]?.[time]) {
			setAllowModifiedDatas((prev) => {
				const newState = { ...prev };
				if (!newState[date]) {
					newState[date] = {};
				}
				newState[date][time] = null;
				return newState;
			});
		}
		setRejectModifiedDatas((prev) => {
			const newState = { ...prev };
			if (!newState[date]) {
				newState[date] = {};
			}
			newState[date][time] = AiModified[date] ? AiModified[date]?.[time] : null;
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
				useAiAssign,
				allowModified,
				rejectModified,
				isAiLoading,
				aiError,
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
