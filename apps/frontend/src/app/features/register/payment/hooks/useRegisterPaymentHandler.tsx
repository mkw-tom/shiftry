import type { RootState } from "@/app/redux/store";
import type { createPaymentType } from "@shared/payment/validations/post";
import { useSelector } from "react-redux";
import { useRegisterLoadingUI } from "../../common/context/useRegisterLoadingUI";
import { postCreatePayment } from "../api/registerPayment";
import { useRegisterPaymentSteps } from "../context/useRegisterPaymentStepContext";

export const useRegisterPaymentHandler = ({
	payload,
}: { payload: createPaymentType }) => {
	const { setApiLoading } = useRegisterLoadingUI();
	const { changeRegistedStep } = useRegisterPaymentSteps();
	const { userToken, storeToken } = useSelector(
		(state: RootState) => state.token,
	);

	const handleRegisterPayment = async () => {
		try {
			setApiLoading(true);
			const res = await postCreatePayment(userToken, storeToken, payload);
			if (!res.ok) {
				if ("errors" in res) {
					console.warn(res.message, res.errors);
					return;
				}
				console.error("エラー:", res.message);
				return;
			}
			changeRegistedStep();
		} catch (e) {
			console.error("登録エラー:", e);
		} finally {
			setApiLoading(false);
		}
	};

	return { handleRegisterPayment };
};
