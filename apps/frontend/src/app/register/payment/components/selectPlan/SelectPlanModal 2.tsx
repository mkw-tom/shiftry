// import React, { useState } from "react";
// import { useRegisterPaymentSteps } from "../../context/useRegisterPaymentStepContext";
// import { useSelectPlan } from "../../context/useSelectPlanContext";
// import PlanCard from "./PlanCard";

// const SelectPlanModal = () => {
// 	const { changeRegistStep } = useRegisterPaymentSteps();
// 	const { selected, plans } = useSelectPlan();

// 	return (
// 		<div className="flex flex-col gap-5">
// 			{plans.map((plan) => (
// 				<PlanCard key={plan.name} plan={plan} />
// 			))}
// 			<button
// 				type="button"
// 				className={`btn btn-sm ${selected?.name === "Max12" ? "bg-green01" : "bg-green02"} sm:btn-md rounded-full border-none w-2/3 mx-auto text-white`}
// 				disabled={selected === null}
// 				onClick={changeRegistStep}
// 			>
// 				{selected !== null ? `${selected.name} を選択` : "選択"}
// 			</button>
// 		</div>
// 	);
// };

// export default SelectPlanModal;
