"use client";
import React from "react";
import { DrawerView, useBottomDrawer } from "../../context/useBottomDrawer";
import { CreateRequestProvider } from "../../context/useCreateRequest";
import { GenereateShiftProvider } from "../../context/useGenerateShift";
import Confirm from "./Confirm";
import Adjustment from "./adjustment/Adjustment";
import ActionButton from "./create-request/ActionButton";
import CreateRequest from "./create-request/CreateRequest";
import DrawerHead from "./elements/DrawerHead";
import Status from "./generate/Status";
import Submit from "./submit/Submit";

const BottomDrawer = () => {
	const { isOpen, drawerClose, view } = useBottomDrawer();
	return (
		<>
			<button
				type="button"
				className={`fixed h-auto top-0 bottom-0 left-0 right-0  z-20 ${
					isOpen ? "bg-[color:var(--color-overlay)]" : "hidden"
				}`}
				onClick={drawerClose}
				onTouchStart={drawerClose}
			/>
			<div className="w-full h-full ">
				<div
					className={`fixed h-[620px] w-full bottom-0  bg-white z-30 rounded-t-lg transition duration-300 ease-in-out  ${
						!isOpen && "translate-y-[620px]"
					} `}
				>
					<button
						type="button"
						className="w-full h-8 flex items-center "
						onClick={drawerClose}
					>
						<div className="bg-gray02 w-32 h-2 mx-auto rounded-sm" />
					</button>
					<div className="w-11/12 mx-auto ">
						<DrawerHead />
						{view === DrawerView.CREATE_REQUEST && (
							<CreateRequestProvider>
								<CreateRequest />
								<ActionButton />
							</CreateRequestProvider>
						)}
						{view === DrawerView.SUBMIT && <Submit />}
						{view === DrawerView.GENERATE && (
							<GenereateShiftProvider>
								<Status />
							</GenereateShiftProvider>
						)}
						{view === DrawerView.ADJUSTMENT && <Adjustment />}
						{view === DrawerView.CONFIRM && <Confirm />}
					</div>
				</div>
			</div>
		</>
	);
};

export default BottomDrawer;
