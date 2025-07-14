import {
	type AssignShiftWithJson,
	ShiftRequestWithJson,
} from "@shared/api/common/types/merged";
import type { ParamValue } from "next/dist/server/request/params";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";
import { IoClose } from "react-icons/io5";
import ChatTextArea from "./ChatTextArea";
import PreviewShfit from "./PreviewShfit";
import { dummy } from "./ShiftContent";

export type ChatHistoryType = {
	talker: "user" | "shiftry";
	text: string;
	data?: AssignShiftWithJson;
};

const AdjustChatContent = ({ id }: { id: ParamValue }) => {
	const [chatHistorys, setChatHistorys] = useState<ChatHistoryType[]>([]);
	const [isShiftryTyping, setIsShiftryTyping] = useState(false);
	const [assingShiftByAI, setAssignShiftByAI] =
		useState<AssignShiftWithJson | null>(null);
	const [prevewAdjustedResult, setPreviewAdjustedResult] = useState(false);

	// ダミー回答のパターン
	const dummyResponses = [
		"シフト調整を確認しました。変更内容を反映いたします。",
		"了解しました。スタッフの皆様に調整内容をお知らせします。",
		"シフトの調整が完了しました。ご確認ください。",
		"調整内容を確認し、最適なシフトを提案させていただきます。",
		"シフト変更を承りました。関係者への連絡を行います。",
	];

	const addChatHistory = (
		talker: "user" | "shiftry",
		text: string,
		data?: AssignShiftWithJson,
	) => {
		setChatHistorys((prev) => [...prev, { talker, text, data }]);

		// ユーザーからのメッセージの場合、shiftryの自動回答をトリガー
		if (talker === "user") {
			simulateShiftryResponse();
		}
	};

	const simulateShiftryResponse = () => {
		setIsShiftryTyping(true);

		// 2-4秒のランダムな遅延でshiftryが回答
		const delay = Math.random() * 2000 + 2000; // 2000-4000ms

		setTimeout(() => {
			const randomResponse =
				dummyResponses[Math.floor(Math.random() * dummyResponses.length)];

			// ランダムでデータ付きの回答を生成（30%の確率）
			const hasData = Math.random() < 0.5;
			const mockData = hasData ? (dummy as AssignShiftWithJson) : undefined;
			mockData && setAssignShiftByAI(mockData);

			setChatHistorys((prev) => [
				...prev,
				{
					talker: "shiftry",
					text: randomResponse,
					data: mockData,
				},
			]);
			setIsShiftryTyping(false);
		}, delay);
	};

	return (
		<div className="w-full h-full">
			<div
				className={`fixed bottom-0 top-0 left-0 right-0 bg-[color:var(--color-overlay)] z-40 ${
					prevewAdjustedResult
						? "translate-y-0 opacity-100"
						: "translate-y-400 opacity-0"
				} transition-all duration-300 ease-linear`}
			>
				<div className="w-full h-screen mt-10 bg-white rounded-t-md">
					<div className="w-full h-10 bg-black backdrop-blur-md shadow-md ">
						<button
							type="button"
							className="w-full h-full ml-5 text-2 text-white text-start  rounded-t-md flex items-center gap-2 justyfy-center "
							onClick={() => setPreviewAdjustedResult(false)}
						>
							<IoClose className="text-2xl" />
							<span className="text-sm">閉じる</span>
						</button>
					</div>
					<PreviewShfit id={id} assingShiftByAI={assingShiftByAI} />
				</div>
			</div>

			<div className="w-full h-auto flex flex-col px-1 pb-80">
				{chatHistorys.map((chat) => {
					if (chat.talker === "user") {
						return (
							<div
								key={chat.text}
								className="w-3/4 h-auto ml-auto bg-base shadow-xs rounded-lg p-4 mt-14"
							>
								<p className="text-sm">{chat.text}</p>
							</div>
						);
					}
					return (
						<div
							key={chat.text}
							className="w-3/4 h-auto mr-auto mt-14 flex items-start gap-1"
						>
							<Image
								src={"/shiftry_logo.png"}
								alt={"ロゴ"}
								width={35}
								height={35}
							/>
							<div className="bg-base shadow-xs rounded-lg p-4 flex flex-col gap-3">
								<p className="text-sm">{chat.text}</p>
								{chat.data && (
									<button
										type="button"
										className="btn w-full bg-green02 text-white rounded-md border-none font-light"
										onClick={() => {
											setPreviewAdjustedResult(true);
										}}
									>
										調整を確認
									</button>
								)}
							</div>
						</div>
					);
				})}

				{/* shiftryがタイピング中の表示 */}
				{isShiftryTyping && (
					<div className="w-3/4 h-auto mr-auto mt-14 flex items-center gap-1">
						<Image
							src={"/shiftry_logo.png"}
							alt={"ロゴ"}
							width={35}
							height={35}
						/>
						<div className="loading loading-dots text-green01" />
					</div>
				)}
			</div>
			<ChatTextArea addChatHistory={addChatHistory} />
		</div>
	);
};

export default AdjustChatContent;
