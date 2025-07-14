import type { AssignShiftWithJson } from "@shared/api/common/types/merged";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { BsEye } from "react-icons/bs";
import { TbSend } from "react-icons/tb";
import { TiMicrophoneOutline } from "react-icons/ti";

const ChatTextArea = ({
	addChatHistory,
}: {
	addChatHistory: (
		talker: "user" | "shiftry",
		text: string,
		data?: AssignShiftWithJson,
	) => void;
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const adjustTextareaHeight = useCallback(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
	}, []);

	const handleSendMessage = () => {
		if (textareaRef.current) {
			const message = textareaRef.current.value.trim();
			if (message) {
				addChatHistory("user", message);
				textareaRef.current.value = "";
				adjustTextareaHeight();
			}
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		adjustTextareaHeight();
	};

	useEffect(() => {
		adjustTextareaHeight();
	}, [adjustTextareaHeight]);

	return (
		<div className="fixed bottom-10 w-full h-auto right-0 left-0 z-30">
			<div className="flex flex-col gap-2 w-auto h-auto mx-2 rounded-2xl shadow-md border border-gray01 bg-white px-3 py-2">
				<textarea
					ref={textareaRef}
					className="w-full min-h-[40px] max-h-[120px] bg-white border-gray-300 rounded-lg p-2 focus:outline-none outline-none text-[15px] resize-none overflow-y-auto"
					placeholder="メッセージを入力..."
					rows={1}
					onChange={handleInputChange}
				/>
				<div className="w-full flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							type="button"
							className="flex items-center gap-1 text-sm text-black"
						>
							<BsEye />
							シフト確認
						</button>
						<button type="button" className="text-sm text-black">
							@スタッフ名
						</button>
					</div>
					<div className="flex items-center gap-3">
						<button type="button" className="text-sm text-black">
							<TiMicrophoneOutline className="text-xl" />
						</button>
						<button
							type="button"
							className="btn btn-sm btn-circle bg-green02 border-none"
							onClick={handleSendMessage}
						>
							<TbSend className="text-white text-lg" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatTextArea;
