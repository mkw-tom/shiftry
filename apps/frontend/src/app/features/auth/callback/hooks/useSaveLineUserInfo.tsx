// "use client";
// import { useNavigation } from "@/app/lib/navigation";
// // import { setLineToken } from "@/app/redux/slices/token";
// import { setRegisterUserInfo } from "@/app/redux/slices/user";
// import type { AppDispatch } from "@/app/redux/store";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useDetectMode } from "./useDetectMode";
// import { useDetectRole } from "./useDetectRole";
// import { useLineAuth } from "./useLineAuth";

// export const useSaveLineUserInfo = () => {
// 	const { userLineInfo, error } = useLineAuth();
// 	const dispatch = useDispatch<AppDispatch>();
// 	const role = useDetectRole();
// 	const mode = useDetectMode();
// 	const { navigateAfterLineAuth, navigateToFail, navigateLogin } =
// 		useNavigation();

// 	useEffect(() => {
// 		if (userLineInfo && mode === "register") {
// 			const { userId, name, pictureUrl, line_token } = userLineInfo;
// 			// dispatch(
// 			// 	setRegisterUserInfo({ pictureUrl: pictureUrl, name: name, id: userId }),
// 			// );
// 			// dispatch(setLineToken(line_token));
// 			navigateAfterLineAuth(role);
// 		} else if (userLineInfo && mode === "login") {
// 			const { line_token } = userLineInfo;
// 			// dispatch(setLineToken(line_token));
// 			navigateLogin();
// 		}
// 	}, [
// 		userLineInfo,
// 		dispatch,
// 		role,
// 		mode,
// 		navigateAfterLineAuth,
// 		navigateLogin,
// 	]);

// 	useEffect(() => {
// 		if (error) {
// 			console.error("エラー:", error);
// 			navigateToFail();
// 		}
// 	}, [error, navigateToFail]);
// };
