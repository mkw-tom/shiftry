export type SelectPlanContextType = {
	plans: Plan[];
	selected: Plan | null;
	selectPlan: (plan: Plan) => void;
	planColoerSwitch: (planName: PlanName) => PlanColorReturn | undefined;
	getProductId: (planName: PlanName) => string;
};

export type PlanColorReturn = {
	text: string;
	border: string;
	bg: string;
};

export enum PlanName {
	Max12 = "Max12",
	Max30 = "Max30",
}

export type Plan = {
	name: PlanName;
	price: string;
	members: string;
	f1: string;
	f2: string;
	f3: string;
};

export enum RegisterPaymentStep {
	Select = 0,
	Regist = 1,
	Registed = 2,
}
export type RegisterPaymentUIContextType = {
	step: RegisterPaymentStep;
	changeRegistStep: () => void;
	changeRegistedStep: () => void;
	headingText: string;
};
