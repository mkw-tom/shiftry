"use client";
import Header from "@/app/features/dashboard/common/components/Header";
import { liffId } from "@/app/lib/env";
import AuthGate from "@/shared/components/AuthGate";
import AuthProvider from "@/shared/context/AuthProvider";
import { useLiffInit } from "@/shared/hooks/useLIffInit";
import { MdErrorOutline } from "react-icons/md";
import FirstView from "../../../shared/components/FirstView";
import RegisterForm from "./components/form/RegisterForm";

const Page = () => {
	const { error, loading } = useLiffInit(liffId.registerOwner);

	if (error !== null) {
		return (
			<main className="w-full h-lvh flex flex-col gap-2 items-center bg-white ">
				<MdErrorOutline className="text-gray02 text-2xl mt-20" />
				<p className="text-gray02">認証エラー</p>
				<p className="text-gray02">エラー: {error}</p>
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

	return (
		<main className="bg-white w-full  h-lvh">
			<div className="bg-white w-full md:w-[410px] mx-auto">
				<FirstView />
				{/* <AuthProvider
					liffId={liffId.registerOwner}
					autoRun={true}
					autoSelectLastStore={false}
				>
					<AuthGate> */}
				<RegisterForm />

				{/* </AuthGate>
				</AuthProvider> */}
			</div>
		</main>
	);
};

export default Page;
