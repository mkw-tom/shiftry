import Image from "next/image";
import React from "react";
import Sideber from "./Sideber";

const Header = () => {
	return (
		<header className="w-full h-12 lg:h-14  bg-white fixed top-0 z-20 border-t-5 border-green02">
			<div className="flex justify-between items-center h-full">
				<h1>
					<div className="flex items-center  gap-1 ml-4 lg:ml-6">
						<Image
							src="/shiftry_logo.png"
							alt="register"
							width={100}
							height={20}
							className="object-cover mx-auto w-7 h-7 lg:w-9 lg:h-9"
						/>
						<h1 className="text-green02 font-bold text-lg lg:text-2xl tracking-wide lg:traking-wider">
							Shiftry
						</h1>
					</div>
				</h1>
				<div className="w-auto h-full">
					<Sideber />
				</div>
			</div>
		</header>
	);
};

export default Header;
