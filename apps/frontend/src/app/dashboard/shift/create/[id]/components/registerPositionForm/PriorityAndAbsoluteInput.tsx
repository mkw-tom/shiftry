import type { RootState } from "@/redux/store";
import type { UpsertShiftPositionBaseInput } from "@shared/api/shiftPosition/validations/put-bulk";
import React, { useState } from "react";
import { type Control, useFieldArray, useWatch } from "react-hook-form";
import { MdAdd, MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
// import { Dummymembers } from "../../context/CreateRequestFormProvider";

type Props = {
	control: Control<UpsertShiftPositionBaseInput>;
};

const PriorityAndAbsoluteInput = ({ control }: Props) => {
	const { members } = useSelector((state: RootState) => state.members);

	const [showMemberList, setShowMemberList] = useState<{
		show: boolean;
		mode: "priority" | "absolute";
	}>({ show: false, mode: "absolute" });

	// RHF: field array 操作用
	const {
		fields: absoluteFields,
		append: appendAbs,
		remove: removeAbs,
	} = useFieldArray({ control, name: "absolute" });

	const {
		fields: priorityFields,
		append: appendPri,
		remove: removePri,
		update: updatePri,
	} = useFieldArray({ control, name: "priority" });

	// 表示用に現在値をRHFから監視
	const absolute = useWatch({ control, name: "absolute" }) ?? [];
	const priority = useWatch({ control, name: "priority" }) ?? [];

	const alreadyIn = (arr: { id: string }[], id: string) =>
		arr?.some((x) => x.id === id);

	const handlePickMember = (user: {
		id: string;
		name: string;
		pictureUrl?: string | null;
	}) => {
		if (showMemberList.mode === "absolute") {
			if (priority.find((u) => u.id === user.id)) return;
			if (alreadyIn(absolute, user.id)) return;
			appendAbs({
				id: user.id,
				name: user.name,
				pictureUrl: user.pictureUrl ?? undefined,
			});
		} else {
			if (absolute.find((u) => u.id === user.id)) return;
			if (alreadyIn(priority, user.id)) return;
			appendPri({
				id: user.id,
				name: user.name,
				pictureUrl: user.pictureUrl ?? undefined,
				level: 1,
			});
		}
	};

	const handleRemoveAbsolute = (id: string) => {
		const idx = absolute.findIndex(
			(x: { name: string; id: string; pictureUrl?: string | undefined }) =>
				x.id === id,
		);
		if (idx >= 0) removeAbs(idx);
	};

	const handleRemovePriority = (id: string) => {
		const idx = priority.findIndex(
			(x: { name: string; id: string; pictureUrl?: string | undefined }) =>
				x.id === id,
		);
		if (idx >= 0) removePri(idx);
	};

	return (
		<>
			{showMemberList.show && (
				<div className="absolute bottom-32 right-0 left-0 mt-5 z-40 bg-white border border-gray-300 rounded shadow-lg mx-3">
					<div className="flex items-center justify-between bg-base px-3">
						<h3 className="text-sm text-gray-600 font-bold">
							{showMemberList.mode === "absolute" ? "固定" : "優先"}スタッフ
						</h3>
						<button
							type="button"
							className="btn btn-link btn-sm text-gray-600"
							onClick={() =>
								setShowMemberList((prev) => ({ ...prev, show: false }))
							}
						>
							閉じる
						</button>
					</div>
					<div className="max-h-60 overflow-y-auto p-3">
						<ul className="flex flex-col gap-2">
							{members.map((m) => (
								<li
									key={m.user.id}
									className="cursor-pointer text-sm flex items-center justify-between py-2 px-3 hover:bg-gray-100"
								>
									<button
										type="button"
										className="flex items-center gap-3"
										onClick={() =>
											handlePickMember({
												id: m.user.id,
												name: m.user.name,
												pictureUrl: m.user.pictureUrl,
											})
										}
									>
										<div className="avatar">
											<div className="w-8 rounded-full">
												<img
													src={(m.user.pictureUrl as string) || ""}
													alt={m.user.name}
												/>
											</div>
										</div>
										<span className="text-black">{m.user.name}</span>
									</button>
									<div className="flex items-center gap-2">
										{alreadyIn(absolute, m.user.id) && (
											<span className="badge badge-sm bg-blue-500 text-white border-none rounded-full">
												<button
													type="button"
													className="mr-1"
													onClick={() => handleRemoveAbsolute(m.user.id)}
												>
													<MdClose />
												</button>
												固定
											</span>
										)}
										{alreadyIn(priority, m.user.id) && (
											<span className="badge badge-sm bg-green-500 text-white border-none rounded-full">
												<button
													type="button"
													className="mr-1"
													onClick={() => handleRemovePriority(m.user.id)}
												>
													<MdClose />
												</button>
												優先
											</span>
										)}
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}

			{/* 固定スタッフ */}
			<div className="mt-5 w-full h-auto flex items-center gap-2">
				<button
					type="button"
					className="btn btn-sm btn-circle border-1 border-dashed border-gray-300 bg-white text-gray-400 shadow-none"
					onClick={() => setShowMemberList({ show: true, mode: "absolute" })}
				>
					<MdAdd />
				</button>
				<h3 className="text-sm text-gray-600">固定スタッフ</h3>
				{absolute.length > 0 ? (
					<div className="avatar-group -space-x-1 ml-3">
						{absolute.map(
							(s: {
								name: string;
								id: string;
								pictureUrl?: string | undefined;
							}) => (
								<div className="avatar border-none" key={s.id}>
									<div className="w-6">
										<img src={s.pictureUrl || ""} alt={s.name} />
									</div>
								</div>
							),
						)}
					</div>
				) : (
					<p className="text-gray02 text-sm flex-1 text-center">未設定</p>
				)}
			</div>

			{/* 優先スタッフ */}
			<div className="mt-4 w-full h-auto flex items-center gap-2">
				<button
					type="button"
					className="btn btn-sm btn-circle border-1 border-dashed border-gray-300 bg-white text-gray-400 shadow-none"
					onClick={() => setShowMemberList({ show: true, mode: "priority" })}
				>
					<MdAdd />
				</button>
				<h3 className="text-sm text-gray-600">優先スタッフ</h3>
				{priority.length > 0 ? (
					<div className="avatar-group -space-x-1 ml-3">
						{priority.map(
							(s: {
								name: string;
								id: string;
								pictureUrl?: string | undefined;
							}) => (
								<div className="avatar  border-none" key={s.id}>
									<div className="w-6">
										<img src={s.pictureUrl || ""} alt={s.name} />
									</div>
								</div>
							),
						)}
					</div>
				) : (
					<p className="text-gray02 text-sm flex-1 text-center">未設定</p>
				)}
			</div>
		</>
	);
};

export default PriorityAndAbsoluteInput;
