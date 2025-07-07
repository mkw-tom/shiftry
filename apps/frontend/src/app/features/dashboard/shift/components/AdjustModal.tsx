import { useState } from "react";

import { $Enums } from "@prisma/client"; // 必要に応じて調整してください
import type { User } from "@shared/api/common/types/prisma";
import { SiOpenai } from "react-icons/si";

const dummyMembers: User[] = [
	{
		name: "たろう",
		id: "user-001",
		createdAt: new Date("2025-06-01T10:00:00Z"),
		updatedAt: new Date("2025-06-01T10:00:00Z"),
		lineId: "line_abc123",
		pictureUrl: "https://example.com/pic1.jpg",
		role: "STAFF",
	},
	{
		name: "じろう",
		id: "user-002",
		createdAt: new Date("2025-06-02T11:30:00Z"),
		updatedAt: new Date("2025-06-02T11:30:00Z"),
		lineId: "line_def456",
		pictureUrl: null,
		role: "OWNER",
	},
	{
		name: "さぶろう",
		id: "user-003",
		createdAt: new Date("2025-06-03T12:00:00Z"),
		updatedAt: new Date("2025-06-03T12:00:00Z"),
		lineId: "line_ghi78",
		pictureUrl: null,
		role: "STAFF",
	},
	{
		name: "すけどう",
		id: "user-004",
		createdAt: new Date("2025-06-04T13:00:00Z"),
		updatedAt: new Date("2025-06-04T13:00:00Z"),
		lineId: "line_jkl012",
		pictureUrl: null,
		role: "STAFF",
	},
];

const AdjustModal = () => {
	const [adjustType, setAdjustType] = useState<"day" | "week" | "all">("day");
	const [adjustDate, setAdjustDate] = useState<string>("");
	const [adjustDateRange, setAdjustDateRange] = useState<{
		start: string;
		end: string;
	}>({ start: "", end: "" });
	const [adjustContent, setAdjustContent] = useState<string>("");
	const [openDropdown, setOpenDropdown] = useState<"template" | "staff" | null>(
		null,
	);

	const handleStartDateChange = (start: string) => {
		const startDate = new Date(start);
		const endDate = new Date(startDate);
		endDate.setDate(startDate.getDate() + 6); // 6日後に設定

		setAdjustDateRange({
			start,
			end: endDate.toISOString().split("T")[0], // "YYYY-MM-DD" に変換
		});
	};
	const clearAdjustForm = () => {
		setAdjustType("day");
		setAdjustDate("");
		setAdjustDateRange({ start: "", end: "" });
		setAdjustContent("");
	};

	return (
		<dialog id="adjust_modal" className="modal modal-bottom sm:modal-middle">
			<div className="modal-box bg-white">
				<h3 className="font-bold text-lg opacity-70 text-black mt-5">
					AIシフト調整
				</h3>
				<ul className="flex gap-2 items-center my-3">
					<li className="text-sm opacity-70 font-thin text-black">範囲選択</li>
					<li className="flex items-center gap-1">
						<input
							type="radio"
							className="radio radio-sm radio-success"
							checked={adjustType === "day"}
							onChange={() => setAdjustType("day")}
						/>
						<span className="text-sm opacity-70 font-thin text-black">日</span>
					</li>
					<li className="flex items-center gap-1">
						<input
							type="radio"
							className="radio radio-sm radio-success"
							checked={adjustType === "week"}
							onChange={() => setAdjustType("week")}
						/>
						<span className="text-sm opacity-70 font-thin text-black">
							週（範囲）
						</span>
					</li>
					<li className="flex items-center gap-1">
						<input
							type="radio"
							className="radio radio-sm radio-success"
							checked={adjustType === "all"}
							onChange={() => setAdjustType("all")}
						/>
						<span className="text-sm opacity-70 font-thin text-black">
							全体
						</span>
					</li>
				</ul>

				<div className="flex flex-col gap-3">
					{adjustType === "day" && (
						<label className="flex flex-col gap-2 mt-2">
							<span className="text-sm opacity-70 font-thin text-black">
								調整日
							</span>
							<input
								type="date"
								className="input input-bordered w-full bg-gray01 text-black"
								value={adjustDate}
								onChange={(e) => setAdjustDate(e.target.value)}
							/>
						</label>
					)}
					{adjustType === "week" && (
						<label className="flex flex-col gap-2 mt-2">
							<span className="text-sm opacity-70 font-thin text-black">
								調整週
							</span>
							<div className="flex items-center gap-1">
								<input
									type="date"
									className="input input-bordered w-full bg-gray01 text-black"
									value={adjustDateRange.start}
									onChange={(e) => handleStartDateChange(e.target.value)}
								/>
								<span className="text-sm opacity-70 font-thin text-black">
									~
								</span>
								<input
									type="date"
									className="input input-bordered w-full bg-gray01 text-black"
									value={adjustDateRange.end}
									onChange={(e) =>
										setAdjustDateRange({
											...adjustDateRange,
											end: e.target.value,
										})
									}
								/>
							</div>
						</label>
					)}
					<div className="flex flex-col gap-2 mt-2">
						<span className="text-sm opacity-70 font-thin text-black">
							調整内容
						</span>
						<div className="flex items-center justify-start gap-1">
							<div
								className={`dropdown dropdown-top ${
									openDropdown === "template" && "dropdown-open"
								}`}
							>
								<button
									type="button"
									className="btn btn-sm bg-gray01 text-black border-none m-1"
									onClick={() => setOpenDropdown("template")}
								>
									テンプレ入力
								</button>
								<ul
									className={`flex flex-col items-start dropdown-content menu bg-base rounded-box z-1 w-52 p-4 shadow-sm text-black ${
										openDropdown !== "template" && "hidden"
									}`}
								>
									<button
										type="button"
										onClick={() => {
											setAdjustContent((prev) => `${prev}\nスタッフ交代`);
											setOpenDropdown(null);
										}}
										className="py-1 px-2 hover:bg-gray01 w-full rounded-md text-left"
									>
										<span>スタッフ交代</span>
									</button>
									<button
										type="button"
										onClick={() => {
											setAdjustContent(
												(prev) => `${prev}\nスタッフ交代（ランダム）`,
											);
											setOpenDropdown(null);
										}}
										className="py-1 px-2 hover:bg-gray01 w-full rounded-md text-left"
									>
										<span>スタッフ交代（ランダム）</span>
									</button>
									<button
										type="button"
										onClick={() => {
											setAdjustContent((prev) => `${prev}\nスタッフ優先度`);
											setOpenDropdown(null);
										}}
										className="py-1 px-2 hover:bg-gray01 w-full rounded-md text-left"
									>
										<span>スタッフ優先度</span>
									</button>
								</ul>
							</div>

							<div
								className={`dropdown dropdown-top ${
									openDropdown === "staff" && "dropdown-open"
								}`}
							>
								<button
									type="button"
									className="btn btn-sm bg-gray01 text-black border-none m-1"
									onClick={() => setOpenDropdown("staff")}
								>
									@スタッフ
								</button>
								<ul
									className={`flex flex-col items-start dropdown-content menu bg-base rounded-box z-1 w-40 p-4 shadow-md text-black ${
										openDropdown !== "staff" && "hidden"
									}`}
								>
									{dummyMembers.map((member) => (
										<button
											type="button"
											key={member.id}
											onClick={() => {
												setAdjustContent((prev) => `${prev}@${member.name} `);
												setOpenDropdown(null);
											}}
											className="py-1 px-2 hover:bg-gray01 w-full rounded-md text-left"
										>
											<span>{member.name}</span>
										</button>
									))}
								</ul>
							</div>
						</div>
						<textarea
							name=""
							id=""
							className="textarea textarea-bordered w-full h-24 bg-gray01 text-black text-[16px]"
							value={adjustContent}
							onChange={(e) => setAdjustContent(e.target.value)}
						/>
					</div>
				</div>

				<div className="modal-action">
					<form method="dialog" className="flex justify-end w-full">
						<button
							type="submit"
							className="fixed top-3 right-0 left-0 w-32 bg-gray02 h-2 mx-auto rounded-sm pointer-events-auto"
							onClick={clearAdjustForm}
						/>
						<button
							type="submit"
							className="flex gap-2 items-center btn rounded-md text-white bg-green02 border-none w-full shadow-md"
						>
							<SiOpenai className="text-lg" />
							<span>AIで調整</span>
						</button>
					</form>
				</div>
			</div>
		</dialog>
	);
};

export default AdjustModal;
