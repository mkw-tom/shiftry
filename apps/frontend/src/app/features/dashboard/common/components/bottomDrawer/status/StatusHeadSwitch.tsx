"use client";
import clsx from "clsx";
import type React from "react";
import { type Dispatch, useState } from "react";

const StatusHeadSwitch = ({
	select,
	setSelect,
	submittedCount,
	notSubmittedCount,
}: {
	select: "SUBMITTED" | "NOT_SUBMIT";
	setSelect: Dispatch<React.SetStateAction<"SUBMITTED" | "NOT_SUBMIT">>;
	submittedCount: number;
	notSubmittedCount: number;
}) => {
	return (
		<div className="w-full mt-3">
			<div className="relative w-full mx-auto bg-gray-200 h-8 rounded-md flex items-center transition-all duration-300">
				{/* スライドする背景 */}
				<div
					className={clsx(
						"absolute top-1 left-1 h-6 w-[49%]  rounded-sm bg-white transition-all duration-300",
						select === "NOT_SUBMIT" && "translate-x-full",
					)}
				/>

				<div className="relative z-10 flex w-full">
					<button
						type="button"
						className={clsx(
							"w-1/2 h-6 rounded-md font-bold text-xs text-center z-10 flex items-center justify-center",
							select === "SUBMITTED" ? "text-black" : "text-gray-500",
						)}
						onClick={() => setSelect("SUBMITTED")}
					>
						<p className="flex items-center gap-2">
							提出済み
							<div
								className={clsx(
									"w-4 h-4 bg-green01 opacity-50 rounded-md text-white text-xs flex items-center justify-center",
									select === "SUBMITTED" && "bg-green01 opacity-100",
								)}
							>
								{submittedCount}
							</div>
						</p>
					</button>
					<button
						type="button"
						className={clsx(
							"w-1/2 h-6 rounded-md font-bold text-xs text-center z-10 flex items-center justify-center",
							select === "NOT_SUBMIT" ? "text-black" : "text-gray-500",
						)}
						onClick={() => setSelect("NOT_SUBMIT")}
					>
						<p className="flex items-center gap-2">
							未提出
							<div
								className={clsx(
									"w-4 h-4 bg-gray02 opacity-50 rounded-md text-white text-xs flex items-center justify-center",
									select === "NOT_SUBMIT" && "opacity-100",
								)}
							>
								{notSubmittedCount}
							</div>
						</p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default StatusHeadSwitch;
