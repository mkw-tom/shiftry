"use client";
import type { RootState } from "@/app/redux/store";
import type { ShiftRequestWithJson } from "@shared/api/common/types/merged";
import type { ShiftRequest } from "@shared/api/common/types/prisma";
import { MDW, YMDHM, YMDW } from "@shared/utils/formatDate";
import React, { useEffect, useState } from "react";
import { LuHistory } from "react-icons/lu";
import { MdDelete, MdErrorOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import Head from "../../common/components/Head";
import {
	DrawerView,
	useBottomDrawer,
} from "../../common/context/useBottomDrawer";
import { useGetArchiveShiftRequests } from "../api/hook";

const ArchivePageContent = () => {
	const [archiveData, setArchiveData] = useState<ShiftRequestWithJson[]>([]);
	const [deleteIds, setDeleteIds] = useState<string[]>([]);

	const handleCheck = (id: string, checked: boolean) => {
		setDeleteIds((prev) =>
			checked ? [...prev, id] : prev.filter((item) => item !== id),
		);
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

				{/* archive list head */}
				<div className="w-full mx-auto h-auto flex flex-col pt-5 shadow-sm bg-green02">
					<div className="w-full flex items-center justify-between mx-auto border-b-1 border-white pb-3 px-5">
						<div className="flex items-center flex-1 gap-2">
							<span className="text-sm text-white">表示：</span>
							<select
								defaultValue="ALL"
								className="select select-sm bg-base shadow-none w-32 font-bold border-gray-300 text-green02"
							>
								<option disabled={true}>絞り込みを選択</option>
								<option value="all">すべて</option>
								<option value="1">1月</option>
								<option value="2">2月</option>
								<option value="3">3月</option>
							</select>
						</div>

						<button
							type="button"
							className={`flex items-center btn btn-sm bg-green03 text-green02 border-none ${deleteIds.length === 0 && "opacity-0"}`}
							disabled={deleteIds.length === 0}
						>
							<MdDelete className="" />
							<span>削除</span>
							<span>（{deleteIds.length}）</span>
						</button>
					</div>
				</div>
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
						{archiveData.map((data: ShiftRequestWithJson) => {
							return (
								<li
									key={data.id}
									className="flex items-center justify-start w-full h-auto p-4 border-b border-gray01"
								>
									<input
										type="checkbox"
										className="checkbox checkbox-sm checkbox-success mr-4"
										onChange={(e) => handleCheck(data.id, e.target.checked)}
									/>
									<div className="flex flex-col gap-1 items-start flex-1">
										<p className="text-black opacity-70 tracking-wide">
											{YMDW(new Date(data.weekStart))} ~{" "}
											{MDW(new Date(data.weekEnd as Date))}
										</p>
										<p className="text-xs text-gray02 tracking-wide">
											更新：{YMDHM(new Date(data.updatedAt))}
										</p>
									</div>
									<button
										type="button"
										className="btn btn-sm border-green02 text-green02 bg-white shadow-none"
										onClick={() => darawerOpen(DrawerView.SUBMIT, null)}
									>
										開く
									</button>
								</li>
							);
						})}
						<li className="flex items-center justify-start w-full h-auto p-4 border-b border-gray01">
							<input
								type="checkbox"
								className="checkbox checkbox-sm checkbox-success mr-4"
								onChange={(e) => handleCheck("124", e.target.checked)}
							/>
							<div className="flex flex-col gap-1 items-start flex-1">
								<p className="text-black opacity-70">
									2025/10/19（月）~ 10/26（日）
								</p>
								<p className="text-xs text-gray02">更新日：2025 10/18 10:00</p>
							</div>
							<button
								type="button"
								className="btn btn-sm border-green02 text-green02 bg-white shadow-none"
							>
								開く
							</button>
						</li>
						<li className="flex items-center justify-start w-full h-auto p-4 border-b border-gray01">
							<input
								type="checkbox"
								className="checkbox checkbox-sm checkbox-success mr-4"
								onChange={(e) => handleCheck("125", e.target.checked)}
							/>
							<div className="flex flex-col gap-1 items-start flex-1">
								<p className="text-black opacity-70">
									2025/10/19（月）~ 10/26（日）
								</p>
								<p className="text-xs text-gray02">更新日：2025 10/18 10:00</p>
							</div>
							<button
								type="button"
								className="btn btn-sm border-green02 text-green02 bg-white shadow-none"
								onClick={() => darawerOpen(DrawerView.SUBMIT, null)}
							>
								開く
							</button>
						</li>
					</ul>
				</div>
			</main>
		</div>
	);
};

export default ArchivePageContent;
