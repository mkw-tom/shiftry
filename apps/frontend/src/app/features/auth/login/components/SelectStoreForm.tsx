import { YMDW } from "@/app/features/common/hooks/useFormatDate";
import type { RootState } from "@/app/redux/store";
import type { Store } from "@shared/common/types/prisma";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useInit } from "../hooks/useInit";

export const dummyStores: Store[] = [
	{
		id: "store-001",
		name: "渋谷コーヒー店",
		groupId: "group-001",
		storeId: null,
		createdAt: new Date("2024-09-01T10:00:00.000Z"),
		updatedAt: new Date("2024-09-10T10:00:00.000Z"),
	},
	{
		id: "store-002",
		name: "新宿ブックカフェ",
		groupId: null,
		storeId: "store-1002",
		createdAt: new Date("2024-10-15T12:30:00.000Z"),
		updatedAt: new Date("2024-10-20T12:30:00.000Z"),
	},
	{
		id: "store-003",
		name: "池袋ベーカリー",
		groupId: "group-003",
		storeId: "store-1003",
		createdAt: new Date("2024-11-20T08:45:00.000Z"),
		updatedAt: new Date("2024-11-25T09:00:00.000Z"),
	},
];

const SelectStoreForm = () => {
	const [selectStore, setSelectStore] = useState<Store | null>(null);
	const { stores } = useSelector((state: RootState) => state.stores);
	const { userToken } = useSelector((state: RootState) => state.token);
	const { handleInit } = useInit();

	return (
		<>
			<div className="overflow-x-auto">
				<table className="table">
					{/* head
					<thead>
						<tr>
							<th />
							<th />
						</tr>
					</thead> */}
					<tbody>
						{stores.map((data) => (
							<tr
								key={data.id}
								className={`${selectStore?.id === data.id ? "bg-green03" : ""}`}
								onTouchEnd={() => setSelectStore(data)}
							>
								<th>
									<label>
										<input
											type="radio"
											className="radio radio-sm radio-success text-success"
											checked={selectStore?.id === data.id}
											onChange={(e) => setSelectStore(data)}
										/>
									</label>
								</th>
								<td>
									<div className="flex items-center gap-3">
										<div>
											<div className="font-bold text-black">{data.name}</div>
											{/* <div className="text-sm opacity-50  text-black">
												{YMDW(new Date(data.createdAt))}
											</div> */}
										</div>
									</div>
								</td>
							</tr>
						))}
					</tbody>
					{/* foot */}
				</table>
			</div>
			<button
				type="button"
				className="btn btn-sm sm:btn-md bg-green02 rounded-full border-none w-2/3 mx-auto text-white"
				disabled={!selectStore}
				onClick={() =>
					handleInit({
						userToken: userToken as string,
						storeId: selectStore?.id as string,
					})
				}
			>
				{!selectStore ? "ログイン" : `${selectStore?.name}`}
			</button>
		</>
	);
};

export default SelectStoreForm;
