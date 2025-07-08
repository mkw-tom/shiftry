import type { RootState } from "@/app/redux/store";
import type { ShiftRequestWithJson } from "@shared/api/common/types/merged";
import React, { useEffect, useMemo, useState } from "react";
import { LuSend } from "react-icons/lu";
import { MdErrorOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { useGetSubmittedShiftUser } from "../../../common/api/get-shift-submit-user/hook";
import NotSubmitCard from "./NotSubmitCard";
import SubmittedCard from "./SubmittedCard";

const SubmitStatusList = () => {
	const { userToken, storeToken } = useSelector(
		(state: RootState) => state.token,
	);
	const { handleGetSubmitShiftUser, isLoading, error, setError } =
		useGetSubmittedShiftUser();
	const { shiftRequests } = useSelector(
		(state: RootState) => state.shiftReuqests,
	);
	const shiftRequestStatusRequest = useMemo(() => {
		return shiftRequests.filter((data) => data.status === "REQUEST");
	}, [shiftRequests]);

	const [shiftRequestsSubmitted, setShiftRequestsSubmitted] = useState<
		ShiftRequestWithJson[]
	>([]);
	const [shiftRequestsNotSubmit, setShiftRequestsNotSubmit] = useState<
		ShiftRequestWithJson[]
	>([]);

	useEffect(() => {
		const fetchData = async () => {
			if (!userToken || !storeToken) {
				setError("ユーザートークンまたはストアトークンが見つかりません");
				return;
			}
			const res = await handleGetSubmitShiftUser({ userToken, storeToken });
			if (res?.ok) {
				const submitted = res.submittedShifts;

				const submittedIds = new Set(submitted.map((s) => s.shiftRequestId));
				const onSubmit: ShiftRequestWithJson[] = [];
				const notSubmit: ShiftRequestWithJson[] = [];

				shiftRequestStatusRequest.map((data) => {
					if (submittedIds.has(data.id)) {
						onSubmit.push(data as ShiftRequestWithJson);
					} else {
						notSubmit.push(data as ShiftRequestWithJson);
					}
				});
				setShiftRequestsSubmitted(onSubmit);
				setShiftRequestsNotSubmit(notSubmit);
			}
		};

		fetchData();
	}, [
		handleGetSubmitShiftUser,
		shiftRequestStatusRequest,
		userToken,
		storeToken,
		setError,
	]);

	// const dummyShiftRequestSubmitted: ShiftRequestWithJson[] = [
	//   {
	//     id: "1",
	//     createdAt: new Date(),
	//     updatedAt: new Date(),
	//     storeId: "1",
	//     type: "MONTHLY",
	//     status: "ADJUSTMENT",
	//     weekStart: new Date("2025-05-01"),
	//     weekEnd: new Date("2025-05-07"),
	//     requests: {
	//       defaultTimePositions: {
	//         Monday: ["09:00-13:00", "14:00-18:00", "19:00-23:00"],
	//         Tuesday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
	//         Wednesday: [],
	//         Thursday: [],
	//         Friday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
	//         Saturday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
	//         Sunday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
	//       },
	//       overrideDates: {
	//         "2025-04-10": ["08:00-12:00"],
	//         "2025-04-14": [],
	//       },
	//     },
	//     deadline: new Date("2025-04-29"),
	//   },
	//   {
	//     id: "2",
	//     createdAt: new Date(),
	//     updatedAt: new Date(),
	//     storeId: "2",
	//     type: "MONTHLY",
	//     status: "HOLD",
	//     weekStart: new Date("2025-05-08"),
	//     weekEnd: new Date("2025-05-15"),
	//     requests: {
	//       overrideDates: {
	//         "2025-04-10": ["08:00-12:00"],
	//         "2025-04-14": [],
	//       },
	//       defaultTimePositions: {
	//         Friday: [],
	//         Monday: ["09:00-13:00"],
	//         Sunday: [],
	//         Tuesday: ["10:00-14:00"],
	//         Saturday: [],
	//         Thursday: [],
	//         Wednesday: [],
	//       },
	//     },
	//     deadline: new Date("2025-05-06"),
	//   },
	// ];

	// const dummyShiftRequestNotSubmitted: ShiftRequestWithJson[] = [
	//   {
	//     id: "3",
	//     createdAt: new Date(),
	//     updatedAt: new Date(),
	//     storeId: "3",
	//     type: "MONTHLY",
	//     status: "REQUEST",
	//     weekStart: new Date("2025-05-08"),
	//     weekEnd: new Date("2025-05-15"),
	//     requests: {
	//       overrideDates: {
	//         "2025-04-10": ["08:00-12:00"],
	//         "2025-04-14": [],
	//       },
	//       defaultTimePositions: {
	//         Friday: [],
	//         Monday: ["09:00-13:00"],
	//         Sunday: [],
	//         Tuesday: ["10:00-14:00"],
	//         Saturday: [],
	//         Thursday: [],
	//         Wednesday: [],
	//       },
	//     },
	//     deadline: new Date("2025-05-06"),
	//   },
	//   {
	//     id: "4",
	//     createdAt: new Date(),
	//     updatedAt: new Date(),
	//     storeId: "4",
	//     type: "MONTHLY",
	//     status: "REQUEST",
	//     weekStart: new Date("2025-05-08"),
	//     weekEnd: new Date("2025-05-15"),
	//     requests: {
	//       overrideDates: {
	//         "2025-04-10": ["08:00-12:00"],
	//         "2025-04-14": [],
	//       },
	//       defaultTimePositions: {
	//         Friday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
	//         Monday: ["09:00-13:00", "14:00-18:00", "19:00-23:00"],
	//         Sunday: [],
	//         Tuesday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
	//         Saturday: [],
	//         Thursday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
	//         Wednesday: ["10:00-14:00", "15:00-19:00", "20:00-23:00"],
	//       },
	//     },
	//     deadline: new Date("2025-05-06"),
	//   },
	// ];

	return (
		<section className="w-full h-auto mx-auto overflow-hidden">
			{/* <Head /> */}
			<div className="w-full mx-auto h-auto flex flex-col pt-7 pb-3 shadow-sm bg-green02">
				<div className="w-full flex items-center justify-start mx-auto px-5 ">
					<h2 className="text-white tracking-wide flex items-center gap-3 text-center font-bold">
						<LuSend />
						<span>提出依頼：{shiftRequestStatusRequest.length}件</span>
						{/* <span>
              提出依頼：
              {dummyShiftRequestNotSubmitted.length +
                dummyShiftRequestSubmitted.length}
              件
            </span> */}
					</h2>
				</div>
			</div>
			{isLoading && (
				<div className="w-full h-lvh flex flex-col items-center bg-gray01">
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
				<div className="w-full h-full overflow-hidden bg-white mt-1">
					<ul className="w-full h-[420px] mx-auto flex flex-col overflow-y-scroll pt-1 pb-80 ">
						{shiftRequestsNotSubmit.map((data) => (
							<NotSubmitCard
								key={data.id}
								data={data as ShiftRequestWithJson}
							/>
						))}
						{shiftRequestsSubmitted.map((data) => (
							<SubmittedCard
								key={data.id}
								data={data as ShiftRequestWithJson}
							/>
						))}

						{/* {dummyShiftRequestNotSubmitted.map((data) => (
              <NotSubmitCard key={data.id} data={data} />
            ))}
            {dummyShiftRequestSubmitted.map((data) => (
              <SubmittedCard key={data.id} data={data} />
            ))} */}
					</ul>
				</div>
			)}
		</section>
	);
};

export default SubmitStatusList;
