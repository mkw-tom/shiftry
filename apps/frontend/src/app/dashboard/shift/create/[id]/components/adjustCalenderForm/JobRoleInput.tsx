import type { RequestPositionWithDateInput } from "@shared/api/shift/request/validations/put";
import type React from "react";
import { useState } from "react";
import type {
	Control,
	UseFormGetValues,
	UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { MdAdd, MdClose, MdDelete } from "react-icons/md";

type Props = {
	control: Control<RequestPositionWithDateInput>;
	setValue: UseFormSetValue<RequestPositionWithDateInput>;
	getValues: UseFormGetValues<RequestPositionWithDateInput>;
	allJobRoles: string[];
	setAllJobRoles: React.Dispatch<React.SetStateAction<string[]>>;
};

const JobRoleInput: React.FC<Props> = ({
	control,
	setValue,
	getValues,
	allJobRoles,
	setAllJobRoles,
}) => {
	const jobRolesSelected = useWatch({ control, name: "jobRoles" }) ?? [];

	const [inputJobRoleValue, setInputJobRoleValue] = useState("");
	const [showList, setShowList] = useState(false);

	const filteredSuggestions = allJobRoles.filter((role) =>
		role.toLowerCase().includes(inputJobRoleValue.toLowerCase()),
	);

	const addRole = (name: string) => {
		const v = name.trim();
		if (!v) return;
		const current = (getValues("jobRoles") ?? []) as string[];
		if (!current.includes(v)) {
			setValue("jobRoles", [...current, v], {
				shouldDirty: true,
				shouldValidate: true,
			});
		}
		if (!allJobRoles.includes(v)) setAllJobRoles((prev) => [...prev, v]);
		setInputJobRoleValue("");
	};

	const deleteRole = (name: string) => {
		const current = (getValues("jobRoles") ?? []) as string[];
		setValue(
			"jobRoles",
			current.filter((r) => r !== name),
			{ shouldDirty: true, shouldValidate: true },
		);
	};

	const deleteFromAll = (name: string) => {
		setAllJobRoles((prev) => prev.filter((r) => r !== name));
		deleteRole(name);
	};

	return (
		<div className="mt-5 w-full h-auto relative">
			<h3 className="text-sm text-gray-600">業務バッジを追加（任意）</h3>

			<div className="flex items-center gap-1">
				<input
					value={inputJobRoleValue}
					onChange={(e) => setInputJobRoleValue(e.target.value)}
					className="input input-bordered w-4/5 text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-success"
					placeholder="業務名を入力 （例：レジ）"
				/>

				<button
					type="button"
					onClick={() => addRole(inputJobRoleValue)}
					className="btn bg-green01 btn-square border-none text-white"
					aria-label="業務を追加"
				>
					<MdAdd />
				</button>

				<button
					type="button"
					className="btn btn-link btn-success btn-sm w-20"
					onClick={() => setShowList(!showList)}
				>
					一覧表示
				</button>
			</div>
			{inputJobRoleValue === "" ||
				(filteredSuggestions.length > 0 && (
					<div className="absolute top-full z-10 bg-white border border-gray-300 rounded shadow-lg w-4/5 max-h-20 overflow-y-auto px-3 py-1.5">
						<ul className="flex flex-col gap-1">
							{filteredSuggestions.map((role) => (
								<li
									key={role}
									onClick={() => addRole(role)}
									className=" text-sm text-gray-500"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											() => addRole(role);
										}
									}}
								>
									{role}
								</li>
							))}
						</ul>
					</div>
				))}

			{/* 候補リスト */}
			{showList && (
				<div className="absolute z-20 mt-2 bg-white border border-gray-300 rounded shadow-lg w-5/6 max-h-50 overflow-y-auto">
					<div className="flex items-center justify-between sticky top-0 bg-gray-100 px-3 py-1">
						<h4 className="text-sm text-gray-600 font-bold">候補一覧</h4>
						<button
							type="button"
							className="btn btn-link btn-xs text-gray-600"
							onClick={() => setShowList(false)}
						>
							閉じる
						</button>
					</div>
					<ul className="flex flex-col">
						{allJobRoles.map((role) => (
							<li
								key={role}
								className="text-sm flex items-center justify-between py-2 px-3 hover:bg-gray-100"
							>
								<button
									type="button"
									className="text-black flex-1 text-left"
									onClick={() => addRole(role)}
								>
									{role}
								</button>

								<div className="flex items-center gap-2">
									{jobRolesSelected.includes(role) && (
										<span className="badge badge-sm bg-green01 text-white border-none rounded-full">
											選択中
										</span>
									)}
									<button
										type="button"
										onClick={() => deleteFromAll(role)}
										className="text-gray02"
									>
										<MdDelete />
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* 選択済み */}
			<ul className="mt-2 flex flex-wrap gap-1">
				{jobRolesSelected.map((role: string) => (
					<li
						key={role}
						className="badge badge-sm text-white bg-gray02 border-none"
					>
						<button
							type="button"
							className="text-white mr-1"
							onClick={() => deleteRole(role)}
							aria-label={`${role} を削除`}
						>
							<MdClose />
						</button>
						{role}
					</li>
				))}
			</ul>
		</div>
	);
};

export default JobRoleInput;
