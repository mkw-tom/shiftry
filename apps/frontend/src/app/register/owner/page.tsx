"use client";
import { useAuthFlow } from "@/app/features/common/hooks/useAuthFlow";
import { liffId } from "@/app/lib/env";
import { useEffect } from "react";
import FirstView from "../../features/common/components/FirstView";
import FormArea from "../../features/register/owner/components/form/FormArea";

const Page = () => {
	const { error, step } = useAuthFlow({
		liffId: liffId.registerOwner,
		autoRun: true,
		autoSelectLastStore: true,
	});

	if (error) return <main className="p-4 text-red-600">エラー: {error}</main>;

	if (
		step === "idle" ||
		step === "verifying" ||
		step === "logging-internal" ||
		step === "selecting"
	) {
		return <main className="p-4">認証中…</main>;
	}

	if (step === "unregistered") {
		return (
			<main className="p-4">
				<p>はじめてのご利用です。アカウント登録をお願いします。</p>
				{/* 例: リンク or その場の登録フォーム */}
			</main>
		);
	}
	return (
		<main className="bg-green01 w-full  h-lvh">
			<div className="bg-green01 w-full md:w-[400px] mx-auto">
				{/* <span className="text-2xl text-black">step: {step}</span>
        <span className="text-2xl text-error">error: {step}</span> */}
				{/* <FirstView />
				<FormArea /> */}
			</div>
		</main>
	);
};

export default Page;
