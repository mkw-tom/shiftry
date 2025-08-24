"use client";
import React, { useState } from "react";
import Head from "./Head";
import HeadSwitch from "./HeadSwitch";
import ShiftRequestList from "./shiftRequests/ShiftRequestList";
import SubmitStatusList from "./submitStatusList/SubmitStatusList";
const HomeContent = () => {
	const [select, setSelect] = useState<"SHIFT" | "SUBMIT">("SHIFT");

	return (
		<div className="w-full h-full">
			<div className="w-full h-auto pt-10  shadow-md ">
				<Head />
				<HeadSwitch select={select} setSelect={setSelect} />
			</div>
			{select === "SHIFT" && <ShiftRequestList />}
			{select === "SUBMIT" && <SubmitStatusList />}
		</div>
	);
};

export default HomeContent;
