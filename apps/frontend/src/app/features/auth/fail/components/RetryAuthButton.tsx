"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useDetectRole } from "../../callback/hooks/useDetectRole";

const RetryAuthButton = () => {
	const router = useRouter();
	const role = useDetectRole();

	const handleRetry = () => {
		const path = role === "OWNER" ? "/register/owner" : "/register/staff";
		router.push(path);
	};

	return (
		<button
			type="button"
			className="btn btn-sm sm:btn-md bg-green02 rounded-full border-none w-2/3 mx-auto text-whit text-white"
			onClick={handleRetry}
		>
			やり直す
		</button>
	);
};

export default RetryAuthButton;
