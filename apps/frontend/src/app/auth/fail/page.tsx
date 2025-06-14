"use client";

import { useSaveLineUserInfo } from "@/app/features/auth/callback/hooks/useSaveLineUserInfo";
import FaildAuthModal from "@/app/features/auth/fail/components/FaildAuthModal";
import FirstView from "@/app/features/common/components/FirstView";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

const FailPageContent = () => {
	useSaveLineUserInfo();
	return (
		<main className="bg-green01 w-full h-lvh">
			<div className="bg-green01 w-full md:w-[400px] mx-auto">
				<FirstView />
				<FaildAuthModal />
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
			<FailPageContent />
		</Suspense>
	);
};

export default Page;
