import { setStoreToken, setUserToken } from "@/app/redux/slices/token";
import type { AppDispatch, RootState } from "@/app/redux/store";
import type { userInputType } from "@shared/api/auth/validations/register-owner";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterLoadingUI } from "../../common/context/useRegisterLoadingUI";
import { postRegisterOwner } from "../api/registerOwner";
import { useRegisterSteps } from "../context/UseRegisterStepContext";

export const useRegisterOwnerHandler = ({
	userInput,
	storeName,
}: {
	userInput: userInputType;
	storeName: string;
}) => {
	const { setApiLoading } = useRegisterLoadingUI();
	const { changeInviteBotStep } = useRegisterSteps();
	const lineToken = useSelector(
		(state: RootState) => state.token.lineToken,
	) as string;
	const dispatch = useDispatch<AppDispatch>();

	const handleRegister = async () => {
		try {
			setApiLoading(true);
			const res = await postRegisterOwner(lineToken, userInput, {
				name: storeName,
			});

			if (!res.ok) {
				if ("errors" in res) {
					console.warn(res.message, res.errors);
					return;
				}
				console.error("エラー:", res.message);
				return;
			}

			// dispatch(setUserToken(res.user_token));
			// dispatch(setStoreToken(res.store_token));

			changeInviteBotStep();
		} catch (e) {
			console.error("登録エラー:", e);
		} finally {
			setApiLoading(false);
		}
	};

	return { handleRegister };
};
