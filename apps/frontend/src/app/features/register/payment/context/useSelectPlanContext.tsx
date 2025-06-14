"use client";

import { PLAN_MAX12, PLAN_MAX30 } from "@/app/lib/env";
import { type ReactNode, createContext, useContext, useState } from "react";
import {
	type Plan,
	type PlanColorReturn,
	PlanName,
	type SelectPlanContextType,
} from "../types/context";

const selectPlanContext = createContext<SelectPlanContextType | undefined>(
	undefined,
);

export const useSelectPlan = () => {
	const context = useContext(selectPlanContext);
	if (context === undefined) {
		throw new Error("useSelectPlan must be used within a selectPlanContext");
	}
	return context;
};

export const SelectPlanProvider = ({ children }: { children: ReactNode }) => {
	const [selected, setSelected] = useState<Plan | null>(null);

	const plans = [
		{
			name: PlanName.Max12,
			price: "1,580",
			f1: "LINE通知",
			f2: "シフト作成AI",
			f3: "休み希望回収",
			members: "12",
		},
		{
			name: PlanName.Max30,
			price: "1,980",
			f1: "LINE通知",
			f2: "シフト作成AI",
			f3: "休み希望回収",
			members: "30",
		},
	];

	function selectPlan(plan: Plan) {
		setSelected(plan);
	}

	function getProductId(planName: PlanName) {
		if (planName === PlanName.Max12) {
			return PLAN_MAX12;
		}
		return PLAN_MAX30;
	}

	function planColoerSwitch(planName: PlanName): PlanColorReturn | undefined {
		if (planName === "Max12") {
			const color = {
				text: "text-green01",
				border: "border-green01",
				bg: "bg-green01",
			};
			return color;
		}
		if (planName === "Max30") {
			const color = {
				text: "text-green02",
				border: "border-green02",
				bg: "bg-green02",
			};
			return color;
		}
	}

	const values = {
		plans,
		selected,
		selectPlan,
		planColoerSwitch,
		getProductId,
	};

	return (
		<selectPlanContext.Provider value={values}>
			{children}
		</selectPlanContext.Provider>
	);
};
