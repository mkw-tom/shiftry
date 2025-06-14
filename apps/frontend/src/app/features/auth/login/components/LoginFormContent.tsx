"use client";
import type { RootState } from "@/app/redux/store";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useInit } from "../hooks/useInit";
import { useLogin } from "../hooks/useLogin";
import LoginError from "./LoginError";
import LoginLoading from "./LoginLoading";
import LoginWithLineButton from "./LoginWithLineButton";
import SelectStoreForm from "./SelectStoreForm";

const LoginFormContent = () => {
	const { stores } = useSelector((state: RootState) => state.stores);
	const { lineToken, userToken } = useSelector(
		(state: RootState) => state.token,
	);
	const {
		isLoading: loginLoading,
		error: loginError,
		handleLogin,
	} = useLogin();
	const { isLoading: initLoading, error: initError, handleInit } = useInit();

	const hasRun = useRef(false);

	useEffect(() => {
		if (!lineToken || hasRun.current) return;
		hasRun.current = true;

		const loginFlow = async () => {
			await handleLogin({ lineToken: lineToken as string });
		};

		loginFlow();
	}, [lineToken, handleLogin]);

	if (loginError !== null || initError !== null) {
		return <LoginError />;
	}

	if (loginLoading || initLoading) {
		return <LoginLoading />;
	}

	if (lineToken && stores.length > 1) {
		return <SelectStoreForm />;
	}

	return <LoginWithLineButton />;
	// return <SelectStoreForm />;
};

export default LoginFormContent;
