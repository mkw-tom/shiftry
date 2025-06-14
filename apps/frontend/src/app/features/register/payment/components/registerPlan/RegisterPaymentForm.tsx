import { useSelectPlan } from "../../context/useSelectPlanContext";
import useEmailValidate from "../../hooks/useEmailValidation";
import usePaymentMethodId from "../../hooks/usePaymentMethodId";
import type { PlanName } from "../../types/context";
import InputCardInfo from "./InputCardInfo";
import InputEmail from "./InputEmail";
import RegisterPaymentButton from "./RegisterPaymentButton";
import SelectedPlanCard from "./SelectedPlanCard";

const RegisterPaymentForm = () => {
	const {
		register,
		errors,
		isDisabled: emailError,
		email,
	} = useEmailValidate();
	const { selected, getProductId } = useSelectPlan();
	const productId = getProductId(selected?.name as PlanName);
	const {
		paymentMethodId,
		handleCardAuth,
		error: cardInfoError,
	} = usePaymentMethodId({ email });

	const payload = {
		productId: productId,
		paymentMethodId: paymentMethodId as string,
		email: email,
	};

	const disabled = !!emailError;

	return (
		<div className="flex flex-col gap-5">
			<SelectedPlanCard />
			<div className="flex flex-col gap-5 mb-3">
				<InputEmail register={register} errors={errors} />
				<InputCardInfo />
			</div>
			<RegisterPaymentButton
				payload={payload}
				handleCardAuth={handleCardAuth}
				disabled={disabled}
			/>
		</div>
	);
};

export default RegisterPaymentForm;
