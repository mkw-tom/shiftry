"use client";
import liff from "@line/liff";
import React, { type PropsWithChildren } from "react";
import { MdErrorOutline } from "react-icons/md";
import { useLiffInit } from "../hooks/useLIffInit";

const InitGate = ({
	liffId,
	children,
	autoLogin = true,
	requireLiffContext = true,
}: {
	liffId: string;
	autoLogin?: boolean;
	requireLiffContext?: boolean;
} & PropsWithChildren) => {
	const { error, loading, loggedIn } = useLiffInit(liffId, {
		autoLogin,
		requireLiffContext,
	});

	if (error) {
		return (
			<main className="w-full h-lvh flex flex-col gap-2 items-center bg-white">
				<MdErrorOutline className="text-gray02 text-2xl mt-20" />
				<p className="text-gray02">認証エラー</p>
				<p className="text-gray02">{error}</p>
				<p className="text-gray02">再度ページ読み込みをお試しください</p>
			</main>
		);
	}

	if (loading) {
		return (
			<main className="w-full h-lvh flex flex-col items-center bg-white">
				<p className="loading loading-spinner text-green02 mt-20" />
				<p className="text-green02 mt-2">読み込み中...</p>
			</main>
		);
	}

	if (!loggedIn) {
		return (
			<main className="w-full h-lvh flex flex-col items-center justify-center bg-white">
				<p className="text-gray02 mb-4">ログインが必要です。</p>
				<button
					type="button"
					className="btn bg-green02 text-white"
					onClick={() => liff.login({ redirectUri: window.location.href })}
				>
					LINEでログイン
				</button>
			</main>
		);
	}

	// ログイン済み
	return <>{children}</>;
};

export default InitGate;
