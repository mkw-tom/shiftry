"use client";
import useAuthFlow from "../../shared/hooks/useAuthFlow";
import Head from "../features/dashboard/common/components/Head";
import HomeContent from "../features/dashboard/index/components/HomeContent";
import { liffId } from "../lib/env";

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
		<main className="bg-white w-full h-lvh">
			<div className="w-full h-full ">
				<HomeContent />
			</div>
		</main>
	);
};

export default Page;
