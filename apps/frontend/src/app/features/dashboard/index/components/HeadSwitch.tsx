"use client";
import type React from "react";
import type { Dispatch } from "react";

const HeadSwitch = ({
	select,
	setSelect,
}: {
	select: "SHIFT" | "SUBMIT";
	setSelect: Dispatch<React.SetStateAction<"SHIFT" | "SUBMIT">>;
}) => {
	return (
		<div className="w-full h-9 mx-auto bg-white rounded-b-md -mt-1">
			<div className="w-full h-full flex flex-col  transition-all duration-300">
				<div className="flex w-full h-full px-4">
					<button
						type="button"
						className={`
							w-1/2 h-auto text-sm text-center z-10 flex flex-col justify-end gap-1
							${select === "SHIFT" ? "text-green02 bg-white font-bold " : "text-gray-500"}
						`}
						onClick={() => setSelect("SHIFT")}
					>
						<span>シフト管理</span>
					</button>
					<button
						type="button"
						className={`
							w-1/2 h-full text-sm text-center z-10 flex flex-col justify-end gap-1
							${select === "SUBMIT" ? "text-green02 bg-white font-bold" : "text-gray-500 "}
						`}
						onClick={() => setSelect("SUBMIT")}
					>
						<span>提出状況</span>
					</button>
				</div>
				<div className="w-full mx-auto px-4 pt-1">
					<div
						className={`flex px-2 items-center w-1/2 h-1 transition-transform duration-200 ease-linear  ${
							select === "SHIFT" ? " translate-x-0" : "translate-x-full"
						} `}
					>
						<div
							className={
								"w-full mx-auto h-1.5 rounded-t-full bg-green02 opacity-80"
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeadSwitch;
