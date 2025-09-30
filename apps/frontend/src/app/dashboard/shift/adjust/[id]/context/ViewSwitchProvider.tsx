"use client";
import { createContext, useContext, useState } from "react";

type ViewSwitchContextType = {
	viewMode: "list" | "table";
	toggleViewMode: () => void;
	switchViewMode: (mode: "list" | "table") => void;
};

const viewSwitchContext = createContext<ViewSwitchContextType | undefined>(
	undefined,
);

export const useViewSwitch = () => {
	const context = useContext(viewSwitchContext);
	if (context === undefined) {
		throw new Error("useViewSwitch must be used within a ViewSwitchProvider");
	}
	return context;
};

export const ViewSwitchProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [viewMode, setViewMode] = useState<"list" | "table">("list");

	const toggleViewMode = () => {
		setViewMode((prevMode) => (prevMode === "table" ? "list" : "table"));
	};
	const switchViewMode = (mode: "list" | "table") => {
		setViewMode(mode);
	};

	return (
		<viewSwitchContext.Provider
			value={{ viewMode, toggleViewMode, switchViewMode }}
		>
			{children}
		</viewSwitchContext.Provider>
	);
};
