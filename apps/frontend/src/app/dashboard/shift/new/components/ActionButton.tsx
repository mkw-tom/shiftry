import React from "react";
import { useCreateRequest } from "../context/useCreateRequest";

const ActionButton = () => {
	const { step, nextStep, prevStep } = useCreateRequest();

	if (step === "select_date") {
		return (
			<div className="absolute bottom-5 left-0 right-0 w-full mx-auto flex justify-center bg-base  px-3 pb-5 pt-3">
				<button
					type="button"
					className="btn w-full bg-green02 text-white border-none"
					onClick={nextStep}
				>
					次へ
				</button>
			</div>
		);
	}

	if (step === "regist_position") {
		return (
			<div className="absolute bottom-5 left-0 right-0 w-full mx-auto flex justify-between gap-1 bg-base  px-3 pb-5 pt-3">
				<button
					type="button"
					className="btn w-1/3 bg-gray02 text-white border-none"
					onClick={prevStep}
				>
					戻る
				</button>
				<button
					type="button"
					className="btn w-2/3 bg-green02 text-white border-none"
					onClick={nextStep}
				>
					次へ
				</button>
			</div>
		);
	}

	if (step === "adjust_position") {
		return (
			<div className="absolute bottom-5 left-0 right-0 w-full mx-auto flex justify-between bg-base gap-1 px-3 pb-5 pt-3">
				<button
					type="button"
					className="btn w-1/3 bg-gray02 text-white border-none"
					onClick={prevStep}
				>
					戻る
				</button>
				<button
					type="button"
					className="btn w-2/3 bg-green02 text-white border-none"
					onClick={nextStep}
				>
					確認へ
				</button>
			</div>
		);
	}
	if (step === "preview") {
		return (
			<div className="absolute bottom-5 left-0 right-0 w-full mx-auto flex justify-between bg-base gap-1 px-3 pb-5 pt-3">
				<button
					type="button"
					className="btn w-1/3 bg-gray02 text-white border-none"
					onClick={prevStep}
				>
					戻る
				</button>
				<button
					type="button"
					className="btn w-2/3 bg-green02 text-white border-none"
					onClick={nextStep}
				>
					シフト提出を依頼
				</button>
			</div>
		);
	}
};

export default ActionButton;
