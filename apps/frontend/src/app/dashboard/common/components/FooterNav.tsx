"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiHome } from "react-icons/bi";
import { LuInbox, LuUsersRound } from "react-icons/lu";
import { RiAiGenerate } from "react-icons/ri";

const FooterNav = () => {
	const router = useRouter();
	const [activePath, setActivePath] = useState<string>("");
	useEffect(() => {
		if (typeof window !== "undefined") {
			setActivePath(window.location.pathname);
		}
	}, []);

	const goTo = (path: string) => {
		router.push(path);
		setActivePath(path);
	};

	return (
		<div className="dock bg-white/90 text-green02">
			<button
				type="button"
				onClick={() => goTo("/dashboard/home")}
				className={activePath === "/dashboard/home" ? "dock-active" : ""}
			>
				<BiHome className="text-lg" />
				<span className="dock-label">ホーム</span>
			</button>

			<button
				type="button"
				onClick={() => goTo("/dashboard/shift/create/new")}
				className={
					activePath === "/dashboard/shift/create/new" ? "dock-active" : ""
				}
			>
				<RiAiGenerate className="text-lg" />
				<span className="dock-label">作成</span>
			</button>

			<button
				type="button"
				onClick={() => goTo("/dashboard/submits")}
				className={activePath === "/dashboard/submits" ? "dock-active" : ""}
			>
				<LuInbox className="text-lg" />
				<span className="dock-label">提出</span>
			</button>
			<button
				type="button"
				onClick={() => goTo("/dashboard/members")}
				className={activePath === "/dashboard/members" ? "dock-active" : ""}
			>
				<LuUsersRound className="text-lg" />
				<span className="dock-label">スタッフ</span>
			</button>
		</div>
	);
};

export default FooterNav;
