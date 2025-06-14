import React from "react";

const CallBackModal = () => {
	return (
		<div className="flex justify-center mt-10 w-full">
			<div className="w-10/12 h-auto bg-white rounded-xl shadow-lg px-5 py-5">
				<div className="mx-auto w-2/3 text-center">
					<div className="text-green01 font-bold">LINEで認証中</div>
					<div className="text-green01 font-bold loading loading-dots" />
				</div>
			</div>
		</div>
	);
};

export default CallBackModal;
