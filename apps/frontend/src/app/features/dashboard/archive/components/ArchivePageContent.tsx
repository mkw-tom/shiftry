"use client";
import type { RootState } from "@/app/redux/store";
import type { ShiftRequestWithJson } from "@shared/api/common/types/merged";
import type { ShiftRequest } from "@shared/api/common/types/prisma";
import { MDW, YMDHM, YMDW } from "@shared/utils/formatDate";
import React, { useEffect, useState } from "react";
import { LuHistory } from "react-icons/lu";
import { MdDelete, MdErrorOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { ar } from "zod/v4/locales";
import Head from "../../common/components/Head";
import {
	DrawerView,
	useBottomDrawer,
} from "../../common/context/useBottomDrawer";
import { useGetArchiveShiftRequests } from "../api/get-archive-shift-request/hook";
import ArchiveListCard from "./ArchiveListCard";
import ArchiveListHead from "./ArchiveListHead";

const ArchivePageContent = () => {
	const [archiveData, setArchiveData] = useState<ShiftRequestWithJson[]>([]);
	const [filterValue, setFilterValue] = useState<number | "all">("all");
	const [ids, setIds] = useState<string[]>([]);

	const handleCheck = (id: string, checked: boolean) => {
		setIds((prev) =>
			checked ? [...prev, id] : prev.filter((item) => item !== id),
		);
	};

	const removeArchiveData = () => {
		const newArchiveData = archiveData.filter(
			(item: ShiftRequestWithJson) => !ids.includes(item.id),
		);
		setArchiveData([...newArchiveData]);
		setIds([]);
	};

	const { handleGetArchiveShiftRequests, isLoading, error } =
		useGetArchiveShiftRequests();
	const { darawerOpen } = useBottomDrawer();
	const { userToken, storeToken } = useSelector(
		(state: RootState) => state.token,
	);

	useEffect(() => {
		const fetchData = async () => {
			const archiveDatas = (await handleGetArchiveShiftRequests({
				userToken,
				storeToken,
			})) as ShiftRequestWithJson[] | null;
			if (archiveDatas === null) return;
			setArchiveData([...archiveDatas]);
		};
		fetchData();
	}, [userToken, storeToken, handleGetArchiveShiftRequests]);

	const filteredArchiveData = archiveData.filter((data) => {
		if (filterValue === "all") return true;
		const startMonth = new Date(data.weekStart).getMonth() + 1;
		return startMonth === filterValue;
	});

	return (
		<div className="w-full h-full">
			<div className="w-full h-auto pt-10 bg-green02 shadow-2xl ">
				<Head />
				{/* archive page head */}
				<div className="w-full h-auto mx-auto bg-white -mt-1 pt-3 ">
					<div className="mx-auto w-40 flex flex-col items-center">
						<h2 className="text-center text-green02 font-bold text-sm pb-1">
							過去のシフト履歴
						</h2>
						<div className="w-full mx-auto h-1.5 rounded-t-full bg-green02 opacity-80" />
					</div>
				</div>

				<ArchiveListHead
					ids={ids}
					removeArchiveData={removeArchiveData}
					setFilterValue={setFilterValue}
				/>
			</div>

			<main className="bg-white w-full h-lvh">
				<div className="w-full h-full  flex flex-col items-center gap-5 pt-3">
					<ul className="w-full ">
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
						{!isLoading && !error && archiveData.length === 0 && (
							<div className="w-full h-50 flex flex-col items-center justify-center gap-2">
								<LuHistory className="text-gray02 text-2xl" />
								<p className="text-gray02 font-bold">過去の履歴がありません</p>
							</div>
						)}
						{filteredArchiveData.map((data: ShiftRequestWithJson) => {
							return (
								<ArchiveListCard
									key={data.id}
									data={data}
									handleCheck={handleCheck}
								/>
							);
						})}
					</ul>
				</div>
			</main>
		</div>
	);
};

export default ArchivePageContent;
