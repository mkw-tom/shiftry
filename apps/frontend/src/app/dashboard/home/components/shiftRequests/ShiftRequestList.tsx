"use client";
import Head from "@/app/dashboard/home/components/Head";
import {
	dummyShiftRequest,
	dummyShiftRequests,
} from "@/app/utils/dummyData/ShiftRequest";
import type { RootState } from "@/redux/store";
import type { ShiftRequestWithJson } from "@shared/api/common/types/merged";
import type { RequestStatus } from "@shared/api/common/types/prisma";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { LuSend } from "react-icons/lu";
import { MdAdd } from "react-icons/md";
import { useSelector } from "react-redux";
import {
	DrawerView,
	useBottomDrawer,
} from "../../../common/context/useBottomDrawer";
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

	const showShiftRequests =
		user?.role === "STAFF"
			? filteredShiftRequests.filter((data) => data.status !== "HOLD")
			: filteredShiftRequests;

	if (activeShiftRequests.length === 0) {
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

						<Link
							href={"/dashboard/shift/create"}
							className="btn btn-sm w-auto border-none rounded-md bg-green02 text-white font-bold shadow-md"
							// onClick={() => darawerOpen(DrawerView.CREATE_REQUEST, null)}
						>
							<MdAdd className="text-white. font-bold" />
							シフト提出依頼を作成する
						</Link>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="w-full h-auto mx-auto overflow-hidden">
			{/* <Head /> */}
			<ShiftRequestsListHead setShiftListFilter={setShiftListFilter} />
			<div className="w-full h-full overflow-hidden bg-white mt-1">
				<ul className="w-full h-[420px] mx-auto flex flex-col overflow-y-scroll pt-1 pb-80 ">
					{showShiftRequests.map((data) => (
						<ShiftRequestCard key={data.id} data={data} />
					))}
				</ul>
			</div>
		</section>
	);
};

export default ShiftRequestList;
