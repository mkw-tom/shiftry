"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";

const PageBackButton = ({
	saveDraftFunc,
	goHome,
	saveSkip,
}: {
	saveDraftFunc?: () => void;
	goHome?: boolean;
	saveSkip?: boolean;
}) => {
	const router = useRouter();

	const handleBack = async () => {
		if (!saveSkip && saveDraftFunc) {
			confirm("前のページに戻ります。現在の編集を保存しますか？") &&
				(await saveDraftFunc());
		}
		if (goHome) {
			router.push("/dashboard/home");
		}
		router.back();
	};
	return (
		<button
			type="button"
			className="text-black absolute left-3 flex items-center"
			onClick={handleBack}
		>
			<IoIosArrowBack />
		</button>
	);
};

export default PageBackButton;
