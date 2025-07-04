import type { SubmittedShiftWithJson } from "@shared/common/types/merged";
import type { User } from "@shared/common/types/prisma";
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
import { useGenerateShiftWithAI } from "../api/generate-shift-ai/hook";
import { useBottomDrawer } from "./useBottomDrawer";

export type GenerateShiftStep =
	| "PREVIEW_SUBMITS"
	| "INPUT_REQUESTS"
	| "GENERATE";

type SubmittedDatasType = {
	submittedShifts: SubmittedShiftWithJson[];
	notSubmittedShifts: User[];
};

type GenerateShiftContextType = {
	step: GenerateShiftStep;
	setStep: Dispatch<SetStateAction<GenerateShiftStep>>;
	formData: CreateShiftValidateType | null;
	setFormData: Dispatch<SetStateAction<CreateShiftValidateType | null>>;
	ownerRequests: OwnerRequestsType;
	setOwnerRequests: Dispatch<SetStateAction<OwnerRequestsType>>;
	submittedDatas: SubmittedDatasType;
	setSubmittedDatas: Dispatch<SetStateAction<SubmittedDatasType>>;
};

const generateShiftContext = createContext<
	GenerateShiftContextType | undefined
>(undefined);

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
	const { drawerClose, currentData } = useBottomDrawer();
	const [step, setStep] = useState<GenerateShiftStep>("PREVIEW_SUBMITS");
	const router = useRouter();

	const [formData, setFormData] = useState<CreateShiftValidateType | null>(
		null,
	);
	const [submittedDatas, setSubmittedDatas] = useState<SubmittedDatasType>({
		submittedShifts: [],
		notSubmittedShifts: [],
	});

	const [ownerRequests, setOwnerRequests] = useState<OwnerRequestsType>([]);
	const { handleGenerateShiftWithAI } = useGenerateShiftWithAI();

	const values = {
		step,
		setStep,
		formData,
		setFormData,
		ownerRequests,
		setOwnerRequests,
		submittedDatas,
		setSubmittedDatas,
	};

	return (
		<generateShiftContext.Provider value={values}>
			{children}
		</generateShiftContext.Provider>
	);
};
