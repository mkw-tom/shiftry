import React from "react";
import LoginFormContent from "./LoginFormContent";
import LoginHead from "./LoginHead";

const LoginFormArea = () => {
	return (
		<div className="flex justify-center mt-10 w-full">
			<div className="w-10/12 h-auto bg-white rounded-xl shadow-lg px-5 py-5">
				<LoginHead />

				<div className="flex flex-col gap-5 mt-5">
					<LoginFormContent />
				</div>
			</div>
		</div>
	);
};

export default LoginFormArea;
