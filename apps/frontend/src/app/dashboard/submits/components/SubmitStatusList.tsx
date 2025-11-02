"use client";
import { useGetSubmittedShfitsMe } from "@/app/api/hook/submittedShift/useGetSubmittedShfit";
import type { RootState } from "@/redux/store";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { LuSend } from "react-icons/lu";
import { MdErrorOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import PageBackButton from "../../common/components/PageBackButton";
import NotSubmitCard from "./NotSubmitCard";
import SubmittedCard from "./SubmittedCard";

const SubmitStatusList = () => {
	const { getSubmittedShfitsMe, isLoading, error } = useGetSubmittedShfitsMe();
	const { activeShiftRequests } = useSelector(
		(state: RootState) => state.activeShiftRequests,
	);
	const shiftRequestStatusRequest = useMemo(() => {
		return activeShiftRequests.filter((data) => data.status === "ADJUSTMENT");
	}, [activeShiftRequests]);

	const [shiftRequestsSubmitted, setShiftRequestsSubmitted] = useState<
		ShiftRequestDTO[]
	>([]);
	const [shiftRequestsNotSubmit, setShiftRequestsNotSubmit] = useState<
		ShiftRequestDTO[]
	>([]);

	const [activeTab, setActiveTab] = useState<
		"all" | "submitted" | "notSubmitted"
	>("all");

	useEffect(() => {
		const fetchData = async () => {
			const res = await getSubmittedShfitsMe();
			if (res?.ok) {
				const submitted = res.submittedShifts;
				const submittedIds = new Set(submitted.map((s) => s.shiftRequestId));
				const onSubmit: ShiftRequestDTO[] = [];
				const notSubmit: ShiftRequestDTO[] = [];
				shiftRequestStatusRequest.map((data) => {
					if (submittedIds.has(data.id)) {
						onSubmit.push(data as ShiftRequestDTO);
					} else {
						notSubmit.push(data as ShiftRequestDTO);
					}
				});
				setShiftRequestsSubmitted(onSubmit);
				setShiftRequestsNotSubmit(notSubmit);
			}
		};
		fetchData();
	}, [getSubmittedShfitsMe, shiftRequestStatusRequest]);

	return (
		<section className="w-full h-auto mx-auto overflow-hidden flex flex-col">
			<div className="flex items-center gap-3 py-3 mx-3 ">
				<PageBackButton />
				<span className="text-green02 font-bold w-full text-center text-sm">
					提出一覧
				</span>
			</div>
			<div className="w-full mx-auto h-auto flex flex-col pb-2 pt-3 bg-white border-b-1 border-b-base">
				<div className="w-10/12 flex items-cneter justify-around text-gray-500 mx-auto">
					<button
						type="button"
						className={`flex items-center gap-2 ${
							activeTab === "all" ? " text-green02" : "text-gray01"
						}`}
						onClick={() => setActiveTab("all")}
					>
						<span className="text-sm">すべて</span>
						<div
							className={`h-4 w-4 rounded-full text-center flex items-center justify-center text-white text-xs ${
								activeTab === "all" ? "bg-green02" : "bg-gray01"
							}`}
						>
							{activeShiftRequests.length}
						</div>
					</button>
					<button
						type="button"
						className={`flex items-center gap-2 ${
							activeTab === "submitted" ? " text-green01" : "text-gray01"
						}`}
						onClick={() => setActiveTab("submitted")}
					>
						<span className="text-sm">提出済</span>
						<div
							className={`h-4 w-4 rounded-full text-center flex items-center justify-center text-white text-xs ${
								activeTab === "submitted" ? "bg-green01" : "bg-gray01"
							}`}
						>
							{shiftRequestsSubmitted.length}
						</div>
					</button>
					<button
						type="button"
						className={`flex items-center gap-2 ${
							activeTab === "notSubmitted" ? " text-gray02" : "text-gray01"
						}`}
						onClick={() => setActiveTab("notSubmitted")}
					>
						<span className="text-sm">未提出</span>
						<div
							className={`h-4 w-4 rounded-full text-center flex items-center justify-center text-white text-xs ${
								activeTab === "notSubmitted" ? "bg-gray02" : "bg-gray01"
							}`}
						>
							{shiftRequestsNotSubmit.length}
						</div>
					</button>
				</div>
			</div>

			{isLoading && (
				<div className="w-full h-lvh flex flex-col items-center">
					<p className="loading loading-spinner text-green02 mt-20" />
					<p className="text-green02 mt-2">読み込み中...</p>
				</div>
			)}
			{error !== null && (
				<div className="w-full h-lvh flex flex-col gap-2 items-center ">
					<MdErrorOutline className="text-gray02 text-2xl mt-20" />
					<p className="text-gray02">読み込みに失敗しました</p>
				</div>
			)}
			{!isLoading && !error && shiftRequestStatusRequest.length === 0 ? (
				<div className="w-full flex flex-col items-center gap-2 mt-20">
					<LuSend className="text-center text-gray02 font-bold text-2xl" />
					<p className="text-center text-gray02 font-bold tracking-wide">
						データが存在しません
					</p>
				</div>
			) : (
				<div className="w-full h-full overflow-hidden bg-white mt-0.5">
					<ul className="w-full mx-auto flex flex-col h-[500px] overflow-y-scroll pt-1 pb-50">
						{activeTab === "all" && (
							<>
								{shiftRequestsNotSubmit.map((data) => (
									<NotSubmitCard key={data.id} data={data} />
								))}
								{shiftRequestsSubmitted.map((data) => (
									<SubmittedCard key={data.id} data={data} />
								))}
							</>
						)}
						{activeTab === "notSubmitted" &&
							shiftRequestsNotSubmit.map((data) => (
								<NotSubmitCard key={data.id} data={data} />
							))}
						{activeTab === "submitted" &&
							shiftRequestsSubmitted.map((data) => (
								<SubmittedCard key={data.id} data={data} />
							))}
					</ul>
				</div>
			)}
		</section>
	);
};

export default SubmitStatusList;
