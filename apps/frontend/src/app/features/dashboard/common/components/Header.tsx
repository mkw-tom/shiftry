import Image from "next/image";
import React from "react";
import Sideber from "./Sideber";

const Header = () => {
	return (
		<header className="bg-green01 w-full h-11">
			<div className="flex justify-between items-center mx-5 h-full">
				<h1>
					<Image
						src="/logo-top.png"
						alt="register"
						width={100}
						height={20}
						className="object-cover mx-auto "
					/>
				</h1>
				<div>
					<Sideber />
				</div>
			</div>
		</header>
	);
};

export default Header;
