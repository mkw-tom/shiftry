"use client";
import type { RootState } from "@/app/redux/store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { set } from "zod/v4-mini";
import Head from "../../common/components/Head";
import { useAutoLogin } from "../../common/hook/useAutoLogin";
import AutoLoginError from "./AutoLoginError";
import AutoLoginLoading from "./AutoLoginLoading";
import HeadSwitch from "./HeadSwitch";
import ShiftRequestList from "./shiftRequests/ShiftRequestList";
import SubmitStatusList from "./submitStatusList/SubmitStatusList";
const HomeContent = () => {
	const [select, setSelect] = useState<"SHIFT" | "SUBMIT">("SHIFT");
	const { userToken, storeToken, groupToken } = useSelector(
		(state: RootState) => state.token,
	);
	const { user } = useSelector((state: RootState) => state.user);
	const { store } = useSelector((state: RootState) => state.store);
	const { stores } = useSelector((state: RootState) => state.stores);
	const { handleAutoLogin, error, isLoading, setError } = useAutoLogin();
	const router = useRouter();
	const searchParams = useSearchParams();
	const storeId = searchParams.get("storeId");
	const shiftRequestId = searchParams.get("shiftRequestId");

	const hasRun = useRef(false);

	useEffect(() => {
		const autoLoginFunc = async () => {
			const tokenRaw = localStorage.getItem("persist:root");
			if (!tokenRaw) {
				router.replace(
					`/register/staff?storeId=${storeId}&shiftRequestId=${shiftRequestId}`,
				);
				return;
			}

			const isLoggedIn = !!user?.id && !!store?.id && stores.length > 0;
			const hasTokens = !!userToken && !!storeToken && !!groupToken;
			if (isLoggedIn || hasRun.current) return;
			if (!hasTokens) {
				setError(true);
				return;
			}

			hasRun.current = true;
			const res = await handleAutoLogin({
				userToken,
				storeToken,
				groupToken,
			});
			if (!res.ok) {
				setError(true);
			}

			if (storeId || shiftRequestId) {
				setSelect("SUBMIT");
			}
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
		storeId,
		shiftRequestId,
		router,
	]);

	if (error === true) {
		return <AutoLoginError storeId={storeId} shiftRequestId={shiftRequestId} />;
	}
	if (isLoading) {
		return <AutoLoginLoading />;
	}

	return (
		<div className="w-full h-full">
			<div className="w-full h-auto pt-10  shadow-md ">
				<Head />
				<HeadSwitch select={select} setSelect={setSelect} />
			</div>
			{select === "SHIFT" && <ShiftRequestList />}
			{select === "SUBMIT" && <SubmitStatusList />}
		</div>
	);
};

export default HomeContent;
