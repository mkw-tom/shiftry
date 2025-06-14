import React from "react";
import RetryAuthButton from "./RetryAuthButton";

const FaildAuthModal = () => {
	return (
		<div className="flex justify-center mt-10 w-full">
			<div className="w-10/12 h-auto bg-white rounded-xl shadow-lg px-5 py-5">
				<div className="mx-auto w-full text-center">
					<div className="text-error font-bold mb-3">認証に失敗しました</div>
					<RetryAuthButton />
				</div>
			</div>
		</div>
	);
};

export default FaildAuthModal;
