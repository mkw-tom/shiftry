import Image from "next/image";
import React from "react";

const FirstView = () => {
	return (
		<div className="w-full pt-20">
			<Image
				src="/logo-top.png"
				alt="register"
				width={200}
				height={100}
				className="object-cover mx-auto"
			/>
			<p className="ml-3 text-center font-bold text-sm mt-2 text-white">
				LINEで、かんたんシフト管理。
			</p>
		</div>
	);
};

export default FirstView;
