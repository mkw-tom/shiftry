import React from "react";
import { useGenareteShift } from "../../../context/useGenerateShift";

const StepBar = () => {
	const { step, setStep } = useGenareteShift();
	return (
		<div className="breadcrumbs text-sm w-full text-green02 font-bold mx-auto ">
			<ul className="flex items-center gap-3">
				<li>
					<button type="button" className="">
						<span
							className={`${
								step === "PREVIEW_SUBMITS" ? "text-green02" : "text-green01"
							}`}
						>
							1. 提出確認
						</span>
					</button>
				</li>

				<li>
					<button type="button" className="text-green02">
						<span
							className={`${
								step === "INPUT_REQUESTS" ? "text-green02" : "text-green01"
							}`}
						>
							2. 優先度の入力
						</span>
					</button>
				</li>

				<li>
					<button type="button">
						<span
							className={`${
								step === "GENERATE" ? "text-green02" : "text-green01"
							}`}
						>
							3. 作成完了
						</span>
					</button>
				</li>
			</ul>
		</div>
	);
};

export default StepBar;
