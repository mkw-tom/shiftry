"use client";
import clsx from "clsx";
import type React from "react";
import { type Dispatch, useState } from "react";

const HeadSwitch = ({
	select,
	setSelect,
}: {
	select: "SHIFT" | "MEMBER";
	setSelect: Dispatch<React.SetStateAction<"SHIFT" | "MEMBER">>;
}) => {
	return (
		<div className="w-11/12 h-9  mx-auto bg-gray-200 rounded-b-sm shadow-md">
			<div className="w-full h-full relative flex items-center transition-all duration-300">
				{/* スライドする背景 */}
				{/* <div
					className={clsx(
						"absolute top-1 left-1 h-6 w-[49%]  rounded-sm bg-white transition-all duration-300",
						select === "MEMBER" && "translate-x-full",
					)}
				/> */}

				<div className="relative z-10 flex w-full h-full p-1 gap-1">
					<button
						type="button"
						className={`
							w-1/2 h-auto rounded-sm text-sm text-center z-10
							${select === "SHIFT" ? "text-green02 bg-white font-bold" : "text-gray-500"}
						`}
						onClick={() => setSelect("SHIFT")}
					>
						シフト管理
					</button>
					<button
						type="button"
						className={`
							w-1/2 h-full rounded-sm text-sm text-center z-10
							${select === "MEMBER" ? "text-green02 bg-white font-bold" : "text-gray-500"}
						`}
						onClick={() => setSelect("MEMBER")}
					>
						メンバー管理
					</button>
				</div>
			</div>
		</div>
	);
};

export default HeadSwitch;
