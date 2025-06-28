"use client";
import type { RootState } from "@/app/redux/store";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useAutoLogin } from "../../common/hook/useAutoLogin";
import AutoLoginLoading from "./AutoLoginLoading";
import HeadSwitch from "./HeadSwitch";
import Head from "./head/Head";
import MembersContent from "./members/MembersContent";
import ShiftRequestList from "./shiftRequests/ShiftRequestList";
const HomeContent = () => {
	const [select, setSelect] = useState<"SHIFT" | "MEMBER">("SHIFT");
	const { userToken, storeToken, groupToken } = useSelector(
		(state: RootState) => state.token,
	);
	const { user } = useSelector((state: RootState) => state.user);
	const { store } = useSelector((state: RootState) => state.store);
	const { stores } = useSelector((state: RootState) => state.stores);
	const { handleAutoLogin, error, isLoading, setError } = useAutoLogin();
	const hasRun = useRef(false);

	useEffect(() => {
		const autoLoginFunc = async () => {
			const isLoggedIn = !!user?.id && !!store?.id && stores.length > 0;
			const hasTokens = !!userToken && !!storeToken && !!groupToken;

			if (isLoggedIn || hasRun.current) return;
			if (!hasTokens) {
				setError(true);
				return;
			}

			hasRun.current = true;
			await handleAutoLogin({ userToken: userToken, storeToken, groupToken });
		};
		autoLoginFunc();
	}, [
		user,
		store,
		stores,
		userToken,
		storeToken,
		groupToken,
		setError,
		handleAutoLogin,
	]);

	// if (error === true) {
	// 	return <AutoLoginError />;
	// }
	if (isLoading) {
		return <AutoLoginLoading />;
	}

	return (
		<div className="w-full h-full">
			<div className="w-full h-auto pt-10 bg-green02 shadow-2xl ">
				<Head />
				<HeadSwitch select={select} setSelect={setSelect} />
			</div>
			{select === "SHIFT" && <ShiftRequestList />}
			{select === "MEMBER" && <MembersContent />}
		</div>
	);
};

export default HomeContent;
