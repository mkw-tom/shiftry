import Image from "next/image";
import React from "react";

const FirstView = () => {
	return (
		<div className="w-full pt-12 flex items-center justify-center  ">
			<Image
				src="/shiftry_logo.png"
				alt="register"
				width={50}
				height={50}
				className="object-cover"
			/>
			<p className="ml-3 text-center font-bold tracking-wider text-3xl text-green02">
				Shiftry
			</p>
		</div>
	);
};

export default FirstView;
