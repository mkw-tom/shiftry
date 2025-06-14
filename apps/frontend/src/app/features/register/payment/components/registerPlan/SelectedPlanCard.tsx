import React from "react";
import { PiUsersFill } from "react-icons/pi";
import { useSelectPlan } from "../../context/useSelectPlanContext";
import type { PlanName } from "../../types/context";

const SelectedPlanCard = () => {
	const { selected, planColoerSwitch, getProductId } = useSelectPlan();
	const planColor = planColoerSwitch(selected?.name as PlanName);

	return (
		<div className={`border-1 ${planColor?.border}  p-3 `}>
			<div
				className={`badge w-20 rounded-full badge-sm ${planColor?.bg} text-white font-bold border-none`}
			>
				{selected?.name}
			</div>
			<h3 className="text-center ">
				<span className="text-xl font-bold text-black">
					¥ {selected?.price}
				</span>
				<span className="text-sm font-bold text-gray02"> / 月</span>
			</h3>
			<p className="flex items-center gap-2 text-xs justify-center mt-2">
				<PiUsersFill className={"text-green01 text-[15px]"} />
				<span className="font-semibold text-gray02">
					メンバー：{selected?.members}人まで
				</span>
			</p>
		</div>
	);
};

export default SelectedPlanCard;
