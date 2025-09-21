// src/shared/auth/AuthGate.tsx
"use client";
import { TEST_MODE } from "@/lib/env";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import useAuthFlow from "../hooks/useAuthFlow";

export default function AuthGate({
	liffId,
	children,
}: { liffId: string } & PropsWithChildren) {
	if (TEST_MODE) {
		return <>{children}</>;
	}

	const router = useRouter();
	const { step, error, chooseStore } = useAuthFlow({
		liffId,
		autoRun: true,
	});

	useEffect(() => {
		if (step === "unregistered") {
			router.replace("/register/staff");
		}
	}, [step, router]);

	if (error) {
		return (
			<main className="w-full h-lvh flex flex-col gap-2 items-center">
				<MdErrorOutline className="text-gray02 text-2xl mt-20" />
				<p className="text-gray02">認証エラー</p>
				<p className="text-gray02">エラー: {error}</p>
			</main>
		);
	}

	if (step === "idle" || step === "verifying" || step === "logging-internal") {
		return (
			<main className="w-full h-lvh flex flex-col items-center bg-white">
				<p className="loading loading-spinner text-green02 mt-20" />
				<p className="text-green02 mt-2">読み込み中...</p>
			</main>
		);
	}

	if (step === "redirecting") {
		return (
			<main className="w-full h-lvh flex flex-col items-center bg-white">
				<p className="loading loading-spinner text-green02 mt-20" />
				<p className="text-green02 mt-2">LINEログインに遷移しています…</p>
			</main>
		);
	}

	if (step === "getting-info") {
		return (
			<main className="w-full h-lvh flex flex-col items-center bg-white">
				<p className="loading loading-spinner text-green02 mt-20" />
				<p className="text-green02 mt-2">プロフィール情報を取得中…</p>
			</main>
		);
	}

	if (step === "need-store") {
		// TODO: 実装に合わせて選択 UI を出す
		// 例）選択肢を出して chooseStore(storeId) を呼ぶ
		return (
			<main className="w-full h-lvh flex flex-col items-center bg-white">
				<p className="text-green02 mt-20">店舗を選択してください…</p>
			</main>
		);
	}

	if (step === "selecting") {
		return (
			<main className="w-full h-lvh flex flex-col items-center bg-white">
				<p className="loading loading-spinner text-green02 mt-20" />
				<p className="text-green02 mt-2">店舗を切り替え中…</p>
			</main>
		);
	}

	// step === "unregistered" のときは useEffect がリダイレクトするのでローディングを表示
	if (step === "unregistered") {
		return (
			<main className="w-full h-lvh flex flex-col items-center bg-white">
				<p className="loading loading-spinner text-green02 mt-20" />
				<p className="text-green02 mt-2">登録ページへ移動しています…</p>
			</main>
		);
	}

	// ready
	return <>{children}</>;
}
