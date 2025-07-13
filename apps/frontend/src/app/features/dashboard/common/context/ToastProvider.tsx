"use client";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import Toast from "../components/Toast";

type ToastType = "success" | "error";

type ToastContextType = {
	showToast: (text: string, type: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);
export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context)
		throw new Error("useToastContext must be used within a ToastProvider");
	return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const [text, setText] = useState("");
	const [type, setType] = useState<ToastType | null>(null);

	const showToast = useCallback((text: string, type: ToastType) => {
		setText(text);
		setType(type);
		setTimeout(() => {
			setType(null);
			setText("");
		}, 3000);
	}, []);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{type && (
				<Toast
					text={text}
					success={type === "success"}
					error={type === "error"}
				/>
			)}
		</ToastContext.Provider>
	);
};
