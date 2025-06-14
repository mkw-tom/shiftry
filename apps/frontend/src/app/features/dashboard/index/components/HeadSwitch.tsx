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
		<div className="w-full mt-3">
			<div className="relative w-11/12 mx-auto bg-gray-200 h-8 rounded-full flex items-center transition-all duration-300">
				{/* スライドする背景 */}
				<div
					className={clsx(
						"absolute top-1 left-1 h-6 w-[49%]  rounded-full bg-white transition-all duration-300",
						select === "MEMBER" && "translate-x-full",
					)}
				/>

				<div className="relative z-10 flex w-full">
					<button
						type="button"
						className={clsx(
							"w-1/2 h-6 rounded-full font-bold text-xs text-center z-10",
							select === "SHIFT" ? "text-black" : "text-gray-500",
						)}
						onClick={() => setSelect("SHIFT")}
					>
						シフト管理
					</button>
					<button
						type="button"
						className={clsx(
							"w-1/2 h-6 rounded-full font-bold text-xs text-center z-10",
							select === "MEMBER" ? "text-black" : "text-gray-500",
						)}
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
