"use client";
import { useShiftConfirm } from "@/app/api/hook/useShfitConfirm";
import { useUpsertAssignShift } from "@/app/api/hook/useUpsertAssignShift";
import { useUpsertShiftReqeust } from "@/app/api/hook/useUpsertShiftReqeust";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { TEST_MODE } from "@/lib/env";
import type { RootState } from "@/redux/store.js";
import type { ShiftStatus } from "@shared/api/common/types/prisma.js";
import type { UpsertAssignShfitInput } from "@shared/api/shift/assign/validations/put";
import type { UpsertShiftRequetInput } from "@shared/api/shift/request/validations/put.js";
import React from "react";
import { BiCheck, BiDownload } from "react-icons/bi";
import { BsTable } from "react-icons/bs";
import { RiArrowGoBackFill, RiFileListLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";
import { useAiAdjustMode } from "../context/AiAdjustModeProvider";
import { useViewSwitch } from "../context/ViewSwitchProvider";
import AIModeBottomDrawer from "./AIModeBottomDrawer";

const Button = () => {
	const { viewMode, toggleViewMode } = useViewSwitch();
	const { aiMode } = useAiAdjustMode();
	const { upsertAssignShift } = useUpsertAssignShift();
	const {
		assignShiftData,
		shiftRequestData,
		setAssignShiftData,
		setShiftRequestData,
	} = useAdjustShiftForm();
	const { upsertShiftRequest } = useUpsertShiftReqeust();
	const { showToast } = useToast();
	const { shiftConfirm } = useShiftConfirm();
	const { user } = useSelector((state: RootState) => state.user);

	const handleNotificationShiftData = async (status: ShiftStatus) => {
		try {
			if (TEST_MODE) {
				setShiftRequestData((prev) => ({ ...prev, status: status }));
				setAssignShiftData((prev) => ({ ...prev, status: status }));
				showToast(
					"テストモードのため、保存処理はスキップされました",
					"success",
				);
				return;
			}
			const upsertAssignShiftData: UpsertAssignShfitInput = {
				shiftRequestId: assignShiftData.shiftRequestId,
				status: status,
				shifts: assignShiftData.shifts,
			};

			const upsertShiftRequestData: UpsertShiftRequetInput = {
				type: shiftRequestData.type,
				requests: shiftRequestData.requests,
				status: status,
				weekEnd: String(shiftRequestData.weekEnd),
				weekStart: String(shiftRequestData.weekStart),
				deadline: String(shiftRequestData.deadline),
			};

			if (status === "CONFIRMED") {
				const res = await shiftConfirm({
					upsertShiftReqeustData: upsertShiftRequestData,
					upsertAssignShiftData: upsertAssignShiftData,
				});
				if (!res.ok) {
					showToast("LINE通知の送信に失敗しました", "error");
					alert(res.message);
					return;
				}
			}

			if (status === "ADJUSTMENT") {
				const asRes = await upsertAssignShift({
					upsertData: upsertAssignShiftData,
					shiftRequestId: assignShiftData.shiftRequestId,
				});
				if (!asRes.ok) {
					if ("errors" in asRes) {
						asRes.errors.map((error) => {
							alert(asRes.message);
							showToast(
								`割り当てデータの保存に失敗しました。validationError:${asRes.message} ${asRes.errors}`,
								"error",
							);
						});
						return;
					}

					alert(asRes.message);
					showToast(
						`割り当てデータの保存に失敗しました。error:${asRes.message}`,
						"error",
					);
					return;
				}

				const srRes = await upsertShiftRequest({
					formData: upsertShiftRequestData,
					shiftRequestId: assignShiftData.shiftRequestId,
				});
				if (!srRes.ok) {
					if ("errors" in srRes) {
						srRes.errors.map((error) => {
							alert(srRes.message);
							showToast(
								`雛形データの更新に失敗しました。validationError:${srRes.message} ${srRes.errors}`,
								"error",
							);
						});
						return;
					}
					alert(srRes.message);
					showToast(
						`雛形データの更新に失敗しました。error:${srRes.message}`,
						"error",
					);
					return;
				}
			}

			setShiftRequestData((prev) => ({ ...prev, status: status }));
			setAssignShiftData((prev) => ({ ...prev, status: status }));
			if (status === "CONFIRMED") {
				showToast("シフトが完成しました", "success");
			}
			if (status === "ADJUSTMENT") {
				showToast("再調整に変更しました", "success");
			}
		} catch (error) {
			showToast("LINE通知の送信に失敗しました", "error");
			alert(error);
			return;
		}
	};

	if (!shiftRequestData || !shiftRequestData.id) return <div />;

	if (user?.role === "STAFF") {
		return (
			<div className="fixed bottom-10 left-0 w-full flex items-center justify-around gap-2  px-3 pt-3 pb-6 bg-white border-t border-gray01 z-10">
				<div className="flex gap-2 items-center flex-1">
					{viewMode === "table" ? (
						<button
							type="button"
							onClick={toggleViewMode}
							className="btn btn-sm border-gray01 bg-white text-black shadow-none w-28"
						>
							<RiFileListLine className="text-xl" />
							リスト
						</button>
					) : (
						<button
							type="button"
							onClick={toggleViewMode}
							className="btn btn-sm border-gray01 bg-white text-black shadow-none w-28"
						>
							<BsTable className="text-lg" />
							テーブル
						</button>
					)}
					<button
						type="button"
						className={`btn btn-sm bg-black text-white font-bold px-4 border-none flex-1 ${
							shiftRequestData.status !== "CONFIRMED"
								? "opacity-20 pointer-events-none"
								: ""
						}`}
						onClick={() => {
							/* TODO: SVGダウンロード処理 */
						}}
					>
						<BiDownload />
						保存
					</button>
				</div>
			</div>
		);
	}

	if (aiMode) return <AIModeBottomDrawer />;

	if (shiftRequestData.status === "CONFIRMED") {
		return (
			<div className="fixed bottom-10 left-0 w-full flex items-center justify-around gap-2  px-3 pt-3 pb-6 bg-white border-t border-gray01 z-10">
				<div className="flex gap-2 items-center flex-1">
					{/* {viewMode === "table" ? (
						<button
							type="button"
							onClick={toggleViewMode}
							className="btn btn-sm border-gray01 bg-white text-black shadow-none w-28"
						>
							<RiFileListLine className="text-xl" />
							リスト
						</button>
					) : (
						<button
							type="button"
							onClick={toggleViewMode}
							className="btn btn-sm border-gray01 bg-white text-black shadow-none w-28"
						>
							<BsTable className="text-lg" />
							テーブル
						</button>
					)} */}
					<button
						type="button"
						className="btn btn-sm bg-green02 text-white border-none flex-1"
						// onClick={() => handleUpsertShiftData("ADJUSTMENT")}
						onClick={() => handleNotificationShiftData("ADJUSTMENT")}
					>
						<RiArrowGoBackFill />
						再調整
					</button>
					<button
						type="button"
						className="btn btn-sm bg-black text-white font-bold px-4 border-none"
						onClick={() => {
							/* TODO: SVGダウンロード処理 */
						}}
					>
						<BiDownload />
						保存
					</button>
				</div>
			</div>
		);
	}

	if (shiftRequestData.status === "ADJUSTMENT") {
		return (
			<div className="fixed bottom-16 left-0 w-full flex justify-center gap-2 px-3 pt-3 bg-white/80 border-t border-gray01 z-50 ">
				<div className="flex gap-2 items-center flex-1">
					{/* <div className="dropdown dropdown-top">
						<div tabIndex={0} role="button" className="btn btn-sm m-1 border-green01 text-green01 bg-white shadow-sm">自動調整</div>
						<ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
							<li><a>Item 1</a></li>
							<li><a>Item 2</a></li>
						</ul>
					</div> */}
					<button
						type="button"
						className="btn btn-sm bg-green02 text-white border-none flex-1"
						// onClick={() => handleUpsertShiftData("CONFIRMED")}
						onClick={() => handleNotificationShiftData("CONFIRMED")}
					>
						<BiCheck />
						シフト完成
					</button>
				</div>
			</div>
		);
	}
};

export default Button;
