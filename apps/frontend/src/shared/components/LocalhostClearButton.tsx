"use client";
import { persistor } from "@/app/redux/store";
import { clearTokens } from "@/app/utils/token";
import React from "react";

const LocalhostClearButton = () => {
	function handleClear() {
		clearTokens();
		persistor.purge().then(() => window.location.reload());
	}

	return (
		<button
			type="button"
			className="btn btn-sm fixed bottom-2 right-2 opacity-70"
			onClick={handleClear}
		>
			🧹 ストレージ初期化
		</button>
	);
};

export default LocalhostClearButton;
