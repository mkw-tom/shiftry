"use client";
import type { RootState } from "@/redux/store";
import type { RequestStatus } from "@shared/api/common/types/prisma";
import React, { useMemo, useState } from "react";
import { LuSend } from "react-icons/lu";
import { useSelector } from "react-redux";
import ShiftRequestCard from "./ShiftRequestCard";
import ShiftRequestsListHead from "./ShiftRequestsListHead";

const ShiftRequestList = () => {
	const [shfitListFilter, setShiftListFilter] = useState<RequestStatus | "ALL">(
		"ALL",
	);

	const { user } = useSelector((state: RootState) => state.user);
	const { activeShiftRequests } = useSelector(
		(state: RootState) => state.activeShiftRequests,
	);

	const filteredShiftRequests = useMemo(() => {
		if (shfitListFilter === "ALL") return activeShiftRequests;
		return activeShiftRequests.filter(
			(data) => data.status === shfitListFilter,
		);
	}, [shfitListFilter, activeShiftRequests]);

	const showShiftRequests = () => {
		if (user?.role === "STAFF") {
			return filteredShiftRequests.filter((data) => data.status !== "HOLD");
		}
		return filteredShiftRequests;
	};

	if (activeShiftRequests.length === 0 || showShiftRequests().length === 0) {
		return (
			<section className="w-full h-auto mx-auto">
				<ShiftRequestsListHead setShiftListFilter={setShiftListFilter} />
				<div className="w-11/12 mx-auto mt-7 h-50 rounded-md">
					<div className="w-full flex flex-col gap-5 items-center justify-center h-full">
						<div className="w-full flex flex-col items-center gap-2 mt-5">
							<LuSend className="text-center text-gray02 font-bold text-2xl" />
							<p className="text-center text-gray02 font-bold tracking-wide">
								データが存在しません
							</p>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="w-full h-auto mx-auto overflow-hidden">
			{user?.role !== "STAFF" && (
				<ShiftRequestsListHead setShiftListFilter={setShiftListFilter} />
			)}
			<div className="w-full h-full overflow-hidden bg-white mt-1">
				<ul className="w-full h-[500px] mx-auto flex flex-col overflow-y-scroll pt-1 pb-50 ">
					{showShiftRequests().map((data) => (
						<ShiftRequestCard key={data.id} data={data} />
					))}
				</ul>
			</div>
		</section>
	);
};

export default ShiftRequestList;
