import { dummyShiftRequests } from "@/app/utils/dummyData/ShiftRequest";
import { dummySubmittedShiftList } from "@/app/utils/dummyData/SubmittedShifts";
import { TEST_MODE } from "@/lib/env";
import type { RootState } from "@/redux/store";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import React, { useEffect, useMemo, useState } from "react";
import { LuSend } from "react-icons/lu";
import { MdErrorOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { useGetSubmittedShiftUser } from "../../hooks/useGetSubmitShiftMe";
import NotSubmitCard from "./NotSubmitCard";
import SubmittedCard from "./SubmittedCard";

const SubmitStatusList = () => {
	const { fetchGetSubmitShiftMe, isLoading, error } =
		useGetSubmittedShiftUser();
	const { activeShiftRequests } = useSelector(
		(state: RootState) => state.activeShiftRequests,
	);
	const shiftRequestStatusRequest = useMemo(() => {
		if (TEST_MODE) {
			return dummyShiftRequests.filter((data) => data.status === "REQUEST");
		}
		return activeShiftRequests.filter((data) => data.status === "REQUEST");
	}, [activeShiftRequests]);

	const [shiftRequestsSubmitted, setShiftRequestsSubmitted] = useState<
		ShiftRequestDTO[]
	>([]);
	const [shiftRequestsNotSubmit, setShiftRequestsNotSubmit] = useState<
		ShiftRequestDTO[]
	>([]);

	useEffect(() => {
		const fetchData = async () => {
			if (TEST_MODE) {
				const submitted = dummySubmittedShiftList;

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
				return;
			}
			const res = await fetchGetSubmitShiftMe();
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
	}, [fetchGetSubmitShiftMe, shiftRequestStatusRequest]);

	return (
		<section className="w-full h-auto mx-auto overflow-hidden">
			{/* <Head /> */}
			<div className="w-full mx-auto h-auto flex flex-col pt-3 pb-2 shadow-sm bg-white border-t-2 border-t-base">
				<div className="w-full flex items-center justify-start mx-auto px-5 ">
					<h2 className="text-green02 tracking-wide flex items-center gap-3 text-center font-bold">
						<LuSend />
						<span>提出依頼：{shiftRequestStatusRequest.length}件</span>
					</h2>
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
					<ul className="w-full h-[420px] mx-auto flex flex-col overflow-y-scroll pt-1 pb-80 ">
						{shiftRequestsNotSubmit.map((data) => (
							<NotSubmitCard key={data.id} data={data} />
						))}
						{shiftRequestsSubmitted.map((data) => (
							<SubmittedCard key={data.id} data={data} />
						))}
					</ul>
				</div>
			)}
		</section>
	);
};

export default SubmitStatusList;
