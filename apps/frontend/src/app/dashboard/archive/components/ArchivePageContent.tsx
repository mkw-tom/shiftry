"use client";
import { useBottomDrawer } from "@/app/dashboard/common/context/useBottomDrawer";
import { TEST_MODE } from "@/lib/env";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";
import React, { useEffect, useState } from "react";
import { LuHistory } from "react-icons/lu";
import { MdErrorOutline } from "react-icons/md";
import { useGetArchiveShiftRequests } from "../api/get-archive-shift-request/hook";
import ArchiveListCard from "./ArchiveListCard";
import ArchiveListHead from "./ArchiveListHead";
import FormHead from "./FormHead";

const ArchivePageContent = () => {
	const [archiveData, setArchiveData] = useState<ShiftRequestDTO[]>([]);
	const [filterValue, setFilterValue] = useState<number | "all">("all");
	const [ids, setIds] = useState<string[]>([]);

	const handleCheck = (id: string, checked: boolean) => {
		setIds((prev) =>
			checked ? [...prev, id] : prev.filter((item) => item !== id),
		);
	};

	const removeArchiveData = () => {
		const newArchiveData = archiveData.filter(
			(item: ShiftRequestDTO) => !ids.includes(item.id),
		);
		setArchiveData([...newArchiveData]);
		setIds([]);
	};

	const { handleGetArchiveShiftRequests, isLoading, error } =
		useGetArchiveShiftRequests();
	const { darawerOpen } = useBottomDrawer();

	useEffect(() => {
		const fetchData = async () => {
			if (TEST_MODE) return;
			const res = await handleGetArchiveShiftRequests();
			if (!res.ok) {
				alert(res.message);
				return;
			}
			setArchiveData([...res.archiveShiftRequests]);
		};
		fetchData();
	}, [handleGetArchiveShiftRequests]);

	const filteredArchiveData = archiveData.filter((data) => {
		if (filterValue === "all") return true;
		const startMonth = new Date(data.weekStart).getMonth() + 1;
		return startMonth === filterValue;
	});

	return (
		<div className="w-full h-lvh bg-white">
			<div className="w-full h-auto shadow-2xl">
				<FormHead />

				<ArchiveListHead
					ids={ids}
					removeArchiveData={removeArchiveData}
					setFilterValue={setFilterValue}
				/>
			</div>

			<main className="bg-white w-full h-auto">
				<div className="w-full h-auto  flex flex-col items-center gap-5 pt-3">
					<ul className="w-full h-auto bg-white">
						{isLoading && (
							<div className="w-full h-full flex flex-col items-center">
								<p className="loading loading-spinner text-green02 mt-20" />
								<p className="text-green02 mt-2">読み込み中...</p>
							</div>
						)}
						{error !== null && (
							<div className="w-full h-full flex flex-col gap-2 items-center ">
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
						{filteredArchiveData.map((data: ShiftRequestDTO) => {
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
