import type {
	CreateShiftValidateType,
	OwnerRequestsType,
} from "@shared/shift/ai/validations/post-create";
import { useRouter } from "next/navigation";
import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	useContext,
	useState,
} from "react";
import { useBottomDrawer } from "./useBottomDrawer";

export type GenerateShiftStep =
	| "PREVIEW_SUBMITS"
	| "INPUT_REQUESTS"
	| "GENERATE";

type GenerateShiftContextType = {
	step: GenerateShiftStep;
	setStep: Dispatch<SetStateAction<GenerateShiftStep>>;
	formData: CreateShiftValidateType;
	setFormData: Dispatch<SetStateAction<CreateShiftValidateType>>;
	ownerRequests: OwnerRequestsType;
	setOwnerRequests: Dispatch<SetStateAction<OwnerRequestsType>>;
	nextStep: (shiftReqeustId: string) => void;
	prevStep: () => void;
};

const generateShiftContext = createContext<
	GenerateShiftContextType | undefined
>(undefined);
export const GereateShiftFormInitData: CreateShiftValidateType = {
	shiftReqeustId: "", // 初期は空文字でOK、実際にはUUIDが入る
	startDate: "", // フォーム入力前提で空
	endDate: "", // 同上
	shiftRequest: {
		overrideDates: {},
		defaultTimePositions: {
			Monday: [],
			Tuesday: [],
			Wednesday: [],
			Thursday: [],
			Friday: [],
			Saturday: [],
			Sunday: [],
		},
	},
	submittedShifts: [],
	ownerRequests: [],
};

export const useGenareteShift = () => {
	const context = useContext(generateShiftContext);
	if (context === undefined) {
		throw new Error(
			"useGeneareteShift must be used within a GenereateShiftProvider",
		);
	}
	return context;
};

export const GenereateShiftProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [step, setStep] = useState<GenerateShiftStep>("PREVIEW_SUBMITS");
	const router = useRouter();
	const [formData, setFormData] = useState<CreateShiftValidateType>(
		GereateShiftFormInitData,
	);
	const [ownerRequests, setOwnerRequests] = useState<OwnerRequestsType>([]);
	const { drawerClose } = useBottomDrawer();

	function nextStep(shfitRequestId: string) {
		if (step === "GENERATE") {
			router.push("/dashboard/shift/4");
			drawerClose();
			return;
		}
		setStep((prev) =>
			prev === "PREVIEW_SUBMITS" ? "INPUT_REQUESTS" : "GENERATE",
		);
	}

	function prevStep() {
		setStep((prev) =>
			prev === "GENERATE" ? "INPUT_REQUESTS" : "PREVIEW_SUBMITS",
		);
	}

	const values = {
		step,
		setStep,
		formData,
		setFormData,
		ownerRequests,
		setOwnerRequests,
		nextStep,
		prevStep,
	};

	return (
		<generateShiftContext.Provider value={values}>
			{children}
		</generateShiftContext.Provider>
	);
};
