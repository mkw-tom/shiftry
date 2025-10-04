"use client";
import { useNotificationConfirmShift } from "@/app/api/hook/useNotificationConfirmShift";
import { useUpsertAssignShift } from "@/app/api/hook/useUpsertAssignShift";
import { useUpsertShiftReqeust } from "@/app/api/hook/useUpsertShiftReqeust";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { TEST_MODE } from "@/lib/env";
import type { ShiftStatus } from "@shared/api/common/types/prisma.js";
import type { UpsertAssignShfitInput } from "@shared/api/shift/assign/validations/put";
import type { UpsertShiftRequetInput } from "@shared/api/shift/request/validations/put.js";
import React from "react";
import { BiCheck, BiDownload } from "react-icons/bi";
import { BsTable } from "react-icons/bs";
import { RiArrowGoBackFill, RiFileListLine } from "react-icons/ri";
import { useAdjustShiftForm } from "../context/AdjustShiftFormContextProvider.tsx";
import { useViewSwitch } from "../context/ViewSwitchProvider";

const Button = () => {
	const { viewMode, toggleViewMode } = useViewSwitch();
	const { upsertAssignShift } = useUpsertAssignShift();
	const {
		assignShiftData,
		shiftRequestData,
		setAssignShiftData,
		setShiftRequestData,
	} = useAdjustShiftForm();
	const { upsertShiftRequest } = useUpsertShiftReqeust();
	const { showToast } = useToast();
	const { notificationConfirmShift } = useNotificationConfirmShift();

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
				const res = await notificationConfirmShift({
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

	// const handleUpsertShiftData = async (status: ShiftStatus) => {
	//   if (TEST_MODE) {
	//     setShiftRequestData((prev) => ({ ...prev, status: status }));
	//     setAssignShiftData((prev) => ({ ...prev, status: status }));
	//     showToast("テストモードのため、保存処理はスキップされました", "success");
	//     return;
	//   }
	//   const upsertAssignShiftData: UpsertAssignShfitInput = {
	//     shiftRequestId: assignShiftData.shiftRequestId,
	//     status: status,
	//     shifts: assignShiftData.shifts,
	//   };
	//   const asRes = await upsertAssignShift({
	//     upsertData: upsertAssignShiftData,
	//     shiftRequestId: assignShiftData.shiftRequestId,
	//   });
	//   if (!asRes.ok) {
	//     if ("errors" in asRes) {
	//       asRes.errors.map((error) => {
	//         alert(asRes.message);
	//         showToast(
	//           `割り当てデータの保存に失敗しました。validationError:${asRes.message} ${asRes.errors}`,
	//           "error"
	//         );
	//       });
	//       return;
	//     }
	//     alert(asRes.message);
	//     showToast(
	//       `割り当てデータの保存に失敗しました。error:${asRes.message}`,
	//       "error"
	//     );
	//     return;
	//   }

	//   const upsertShiftRequestData: UpsertShiftRequetInput = {
	//     type: shiftRequestData.type,
	//     requests: shiftRequestData.requests,
	//     status: status,
	//     weekEnd: String(shiftRequestData.weekEnd),
	//     weekStart: String(shiftRequestData.weekStart),
	//     deadline: String(shiftRequestData.deadline),
	//   };
	//   const srRes = await upsertShiftRequest({
	//     formData: upsertShiftRequestData,
	//     shiftRequestId: assignShiftData.shiftRequestId,
	//   });
	//   if (!srRes.ok) {
	//     if ("errors" in srRes) {
	//       srRes.errors.map((error) => {
	//         alert(srRes.message);
	//         showToast(
	//           `雛形データの更新に失敗しました。validationError:${srRes.message} ${srRes.errors}`,
	//           "error"
	//         );
	//       });
	//       return;
	//     }
	//     alert(srRes.message);
	//     showToast(
	//       `雛形データの更新に失敗しました。error:${srRes.message}`,
	//       "error"
	//     );
	//     return;
	//   }

	//   setShiftRequestData((prev) => ({ ...prev, status: status }));
	//   setAssignShiftData((prev) => ({ ...prev, status: status }));

	//   if (status === "CONFIRMED") {
	//     showToast("シフトが完成しました", "success");
	//   }
	//   if (status === "ADJUSTMENT") {
	//     showToast("再調整に変更しました", "success");
	//   }
	// };

	if (!shiftRequestData || !shiftRequestData.id) return <div />;

	if (shiftRequestData.status === "CONFIRMED") {
		return (
			<div className="fixed bottom-0 left-0 w-full flex items-center justify-around gap-2  px-3 pt-3 pb-6 bg-white border-t border-gray01 z-10">
				<div className="flex gap-2 items-center flex-1">
					{viewMode === "table" ? (
						<button
							type="button"
							onClick={toggleViewMode}
							className="btn btn-sm border-gray01 bg-white text-black shadow-none w-28"
						>
							<RiFileListLine className="text-xl" />
							調整
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
			<div className="fixed bottom-0 left-0 w-full flex justify-center gap-2 px-3 pt-3 pb-6 bg-white border-t border-gray01 z-50 ">
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

				<div className="flex gap-2 items-center flex-1">
					<button
						type="button"
						className="btn btn-sm bg-green02 text-white border-none flex-1"
						// onClick={() => handleUpsertShiftData("CONFIRMED")}
						onClick={() => handleNotificationShiftData("CONFIRMED")}
					>
						<BiCheck />
						シフト完成
					</button>
					<button
						type="button"
						className="btn btn-sm bg-gray02 text-white border-none"
					>
						ヘルプ通知
					</button>
				</div>
			</div>
		);
	}
};

export default Button;
