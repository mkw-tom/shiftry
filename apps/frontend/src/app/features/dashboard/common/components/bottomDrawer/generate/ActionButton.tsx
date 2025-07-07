
import React from "react";
import { SiOpenai } from "react-icons/si";
import { useBottomDrawer } from "../../../context/useBottomDrawer";
import {
	type GenerateShiftStep,
	useGenareteShift,
} from "../../../context/useGenerateShift";
import { useGenerateShiftHook } from "../../../hook/useGenerateShiftHook";

const ActionButton = () => {
	const { view, currentData, drawerClose } = useBottomDrawer();
	const { step } = useGenareteShift();
	const { nextStep, prevStep } = useGenerateShiftHook();

	function handleBtnTextAndStyle(step: GenerateShiftStep) {
		switch (step) {
			case "PREVIEW_SUBMITS": {
				return {
					text: "次へ",
					icon: null,
					color: "bg-green02",
					disabled: false,
				};
			}
			case "INPUT_REQUESTS": {
				return {
					text: "シフト作成へ",
					icon: <SiOpenai />,
					color: "bg-green02",
					disabled: false,
				};
			}
			case "GENERATE":
				return {
					text: "シフト調整画面へ",
					icon: null,
					color: "bg-green02",
					disabled: false,
				};
			default:
				return { text: "操作を選択", color: "bg-green02", disabled: false };
		}
	}

	return (
		<div className="w-full flex items-center justify-between mx-auto mb-5">
			{step !== "PREVIEW_SUBMITS" && (
				<button
					type="button"
					className="btn w-1/3 h-10 bg-gray02 shadow-xl rounded-md font-bold text-sm text-white border-none mr-2"
					onClick={() => prevStep()}
				>
					前へ戻る
				</button>
			)}
			<button
				type="button"
				className={`btn flex-1 h-10 ${
					handleBtnTextAndStyle(step).color
				} shadow-xl rounded-md font-bold text-sm text-white border-none`}
				onClick={() => nextStep()}
				disabled={handleBtnTextAndStyle(step).disabled}
			>
				{handleBtnTextAndStyle(step).icon}
				{handleBtnTextAndStyle(step).text}
			</button>
		</div>
	);
};

export default ActionButton;
