// import React, { Dispatch } from "react";
// import { FaCheck } from "react-icons/fa";
// import { PiUsersFill } from "react-icons/pi";
// import { useSelectPlan } from "../../context/useSelectPlanContext";
// import type { Plan } from "../../types/context";

// const PlanCard = ({ plan }: { plan: Plan }) => {
// 	const { selectPlan, planColoerSwitch, selected } = useSelectPlan();
// 	const { name, price, f1, f2, f3, members } = plan;
// 	const planColor = planColoerSwitch(name);

// 	return (
// 		<button
// 			type="button"
// 			key={plan.name}
// 			className={`bg-white shadow-md p-3 rounded-md ${
// 				selected?.name === name
// 					? `border-4 ${planColor?.border} -translate-y-1 transition ease-linear`
// 					: "border-1 border-gray01 "
// 			} `}
// 			onClick={() => selectPlan(plan)}
// 		>
// 			<div className="flex w-full">
// 				<div className="flex flex-col gap-2 border-gray01 w-full ">
// 					<div
// 						className={`badge ${planColor?.bg} text-white rounded-full badge-sm w-20 font-bold tracking-wide  border-none`}
// 					>
// 						{name}
// 					</div>
// 					<div className="pt-2 pb-2">
// 						<h3 className="text-center ">
// 							<span className="text-2xl font-bold text-black">¥ {price}</span>
// 							<span className="text-sm font-bold text-gray02"> / 月</span>
// 						</h3>
// 						<p className="flex items-center gap-2 text-xs justify-center mt-2">
// 							<PiUsersFill className={`${planColor?.text} text-[15px]`} />
// 							<span className="font-semibold text-gray02">
// 								メンバー：{members}人まで
// 							</span>
// 						</p>
// 					</div>
// 					<ul className="flex flex-wrap gap-3 w-full justify-center">
// 						<li className="flex items-center gap-1 text-[10px]">
// 							<FaCheck className={`${planColor?.text}`} />
// 							<span className="font-semibold text-gray02">{f1}</span>
// 						</li>
// 						<li className="flex items-center gap-1 text-[10px]">
// 							<FaCheck className={`${planColor?.text}`} />
// 							<span className="font-semibold text-gray02">{f2}</span>
// 						</li>
// 						<li className="flex items-center gap-1 text-[10px]">
// 							<FaCheck className={`${planColor?.text}`} />
// 							<span className="font-semibold text-gray02">{f3}</span>
// 						</li>
// 					</ul>
// 				</div>
// 			</div>
// 		</button>
// 	);
// };

// export default PlanCard;
