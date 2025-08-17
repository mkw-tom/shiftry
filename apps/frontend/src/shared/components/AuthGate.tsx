// src/shared/auth/AuthGate.tsx
"use client";
import type { PropsWithChildren } from "react";
import { MdErrorOutline } from "react-icons/md";
import { useAuth } from "../context/AuthProvider";

export default function AuthGate({ children }: PropsWithChildren) {
	const { step, error } = useAuth();

	if (error)
		return (
			<main className="w-full h-lvh flex flex-col gap-2 items-center ">
				<MdErrorOutline className="text-gray02 text-2xl mt-20" />
				<p className="text-gray02">認証エラー</p>
				<p className="text-gray02">エラー: {error}</p>
			</main>
		);

	if (
		step === "idle" ||
		step === "verifying" ||
		step === "logging-internal" ||
		step === "selecting"
	) {
		return (
			<main className="w-full h-lvh flex flex-col items-center bg-gray01">
				<p className="loading loading-spinner text-green02 mt-20" />
				<p className="text-green02 mt-2">読み込み中...</p>
			</main>
		);
	}

	// if (step === "unregistered") {
	//   return (
	//     <main className="p-4">
	//       <p>はじめてのご利用です。アカウント登録をお願いします。</p>
	//     </main>
	//   );
	// }

	// if (step === "need-store") {
	//   // ここで店舗選択UIを出す or モーダルを出す（useAuth().chooseStore を使う）
	//   return <main className="p-4">店舗を選択してください…</main>;
	// }

	// ready
	return <>{children}</>;
}
