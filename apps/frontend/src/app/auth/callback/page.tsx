"use client";

import CallBackModal from "@/app/features/auth/callback/componets/CallBackModal";
import { useSaveLineUserInfo } from "@/app/features/auth/callback/hooks/useSaveLineUserInfo";
import FirstView from "@/app/features/common/components/FirstView";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

const CallbackPageContent = () => {
	useSaveLineUserInfo();

	return (
		<main className="bg-green01 w-full h-lvh">
			<div className="bg-green01 w-full md:w-[400px] mx-auto">
				<FirstView />
				<CallBackModal />
			</div>
		</main>
	);
};

const Page = () => {
	return (
		<Suspense
			fallback={
				<div className="text-white text-center mt-20">読み込み中...</div>
			}
		>
			<CallbackPageContent />
		</Suspense>
	);
};

export default Page;
