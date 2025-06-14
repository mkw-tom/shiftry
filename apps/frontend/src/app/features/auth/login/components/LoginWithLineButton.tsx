"use client";

import { generateLineLoginUrl } from "@/app/lib/line";
import { setStores } from "@/app/redux/slices/stores";
import { setLineToken } from "@/app/redux/slices/token";
import type { Store } from "@shared/common/types/prisma";
import React from "react";
import { useDispatch } from "react-redux";

export const dummyStores: Store[] = [
	{
		id: "store-001",
		name: "渋谷コーヒー店",
		groupId: "group-001",
		storeId: null,
		createdAt: new Date("2024-09-01T10:00:00.000Z"),
		updatedAt: new Date("2024-09-10T10:00:00.000Z"),
	},
	{
		id: "store-002",
		name: "新宿ブックカフェ",
		groupId: null,
		storeId: "store-1002",
		createdAt: new Date("2024-10-15T12:30:00.000Z"),
		updatedAt: new Date("2024-10-20T12:30:00.000Z"),
	},
	{
		id: "store-003",
		name: "池袋ベーカリー",
		groupId: "group-003",
		storeId: "store-1003",
		createdAt: new Date("2024-11-20T08:45:00.000Z"),
		updatedAt: new Date("2024-11-25T09:00:00.000Z"),
	},
];

const LoginWithLineButton = () => {
	const dispatch = useDispatch();

	function handleLineLogin() {
		window.location.href = generateLineLoginUrl("OWNER", "login");
	}
	// const dummyLoginFunc = () => {
	// 	dispatch(setLineToken("dummy"));
	// 	dispatch(setStores(dummyStores));
	// };

	return (
		<button
			type="button"
			className="btn btn-sm sm:btn-md bg-green02 rounded-full border-none w-2/3 mx-auto text-white"
			onClick={handleLineLogin}
			// onClick={dummyLoginFunc}
		>
			<div className="flex items-center gap-2">
				<svg
					aria-label="Line logo"
					width="16"
					height="16"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
				>
					<title>invite lineBot</title>
					<g fillRule="evenodd" strokeLinejoin="round" fill="white">
						<path
							fillRule="nonzero"
							d="M12.91 6.57c.232 0 .42.19.42.42 0 .23-.188.42-.42.42h-1.17v.75h1.17a.42.42 0 1 1 0 .84h-1.59a.42.42 0 0 1-.418-.42V5.4c0-.23.188-.42.42-.42h1.59a.42.42 0 0 1-.002.84h-1.17v.75h1.17zm-2.57 2.01a.421.421 0 0 1-.757.251l-1.63-2.217V8.58a.42.42 0 0 1-.42.42.42.42 0 0 1-.418-.42V5.4a.418.418 0 0 1 .755-.249L9.5 7.366V5.4c0-.23.188-.42.42-.42.23 0 .42.19.42.42v3.18zm-3.828 0c0 .23-.188.42-.42.42a.42.42 0 0 1-.418-.42V5.4c0-.23.188-.42.42-.42.23 0 .418.19.418.42v3.18zM4.868 9h-1.59c-.23 0-.42-.19-.42-.42V5.4c0-.23.19-.42.42-.42.232 0 .42.19.42.42v2.76h1.17a.42.42 0 1 1 0 .84M16 6.87C16 3.29 12.41.376 8 .376S0 3.29 0 6.87c0 3.208 2.846 5.896 6.69 6.405.26.056.615.172.705.394.08.2.053.518.026.722 0 0-.092.565-.113.685-.035.203-.16.79.693.432.854-.36 4.607-2.714 6.285-4.646C15.445 9.594 16 8.302 16 6.87"
						/>
					</g>
				</svg>
				LINEでログイン
			</div>
		</button>
	);
};

export default LoginWithLineButton;
