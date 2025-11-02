"use client";
import type { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiHome } from "react-icons/bi";
import { CgSelect } from "react-icons/cg";
import { LuUsersRound } from "react-icons/lu";
import { useSelector } from "react-redux";
import Sideber from "./Sideber";

const Header = () => {
	const { user } = useSelector((state: RootState) => state.user);
	const { store } = useSelector((state: RootState) => state.store);
	return (
		<header className="w-full h-12 lg:h-14  bg-white fixed top-0 z-20">
			<div className="flex justify-between items-center h-full">
				<div className="flex items-center w-auto h-full gap-6">
					<Sideber />
				</div>

				<h1 className="flex items-center text-center gap-2 min-w-20 max-w-50 mr-auto">
					<p className="text-gray-800 text-sm w-full text-center">
						{store?.name}
					</p>
					<CgSelect className="text-gray-800 ml-auto" />
				</h1>

				<div>
					<Image
						src={"/default_user_image.png"}
						width={100}
						height={100}
						alt="profile"
						className="w-7 h-7 lg:w-10 lg:h-10 rounded-full object-cover mr-4 lg:mr-6"
					/>
				</div>
			</div>
		</header>
	);
};

export default Header;
