// import type { RootState } from "@/app/redux/store";
// import type { Store } from "@shared/api/common/types/prisma";
// import { UserStoreLiteWithStore } from "@shared/api/common/types/prismaLite";
// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { useInit } from "../hooks/useInit";

// export const dummyStores: Store[] = [
// 	{
// 		id: "store-001",
// 		name: "渋谷コーヒー店",
// 		// groupId: "group-001",
// 		groupId_hash: null,
// 		groupId_enc: null,
// 		groupKeyVersion_hash: "",
// 		groupKeyVersion_enc: "",
// 		consentAt: null,
// 		isActive: true,
// 		createdAt: new Date("2024-09-01T10:00:00.000Z"),
// 		updatedAt: new Date("2024-09-10T10:00:00.000Z"),
// 	},
// 	{
// 		id: "store-002",
// 		name: "新宿ブックカフェ",
// 		// groupId: null,
// 		groupId_hash: null,
// 		groupId_enc: null,
// 		groupKeyVersion_hash: "",
// 		groupKeyVersion_enc: "",
// 		consentAt: null,
// 		isActive: true,
// 		createdAt: new Date("2024-10-15T12:30:00.000Z"),
// 		updatedAt: new Date("2024-10-20T12:30:00.000Z"),
// 	},
// 	{
// 		id: "store-003",
// 		name: "池袋ベーカリー",
// 		// groupId: "group-003",
// 		groupId_hash: null,
// 		groupId_enc: null,
// 		groupKeyVersion_hash: "",
// 		groupKeyVersion_enc: "",
// 		consentAt: null,
// 		isActive: true,
// 		createdAt: new Date("2024-11-20T08:45:00.000Z"),
// 		updatedAt: new Date("2024-11-25T09:00:00.000Z"),
// 	},
// ];

// const SelectStoreForm = () => {
// 	const [selectStoreId, setSelectStore] = useState<string | null>(null);
// 	const { stores } = useSelector((state: RootState) => state.stores);
// 	const { userToken } = useSelector((state: RootState) => state.token);
// 	const { handleInit } = useInit();

// 	return (
// 		<>
// 			<div className="overflow-x-auto">
// 				<table className="table">
// 					{/* head
// 					<thead>
// 						<tr>
// 							<th />
// 							<th />
// 						</tr>
// 					</thead> */}
// 					<tbody>
// 						{stores.map((data) => (
// 							<tr
// 								key={data.storeId}
// 								className={`${selectStoreId === data.storeId ? "bg-green03" : ""}`}
// 								onTouchEnd={() => setSelectStore(data.storeId)}
// 							>
// 								<th>
// 									<label>
// 										<input
// 											type="radio"
// 											className="radio radio-sm radio-success text-success"
// 											checked={selectStoreId === data.storeId}
// 											onChange={(e) => setSelectStore(data.storeId)}
// 										/>
// 									</label>
// 								</th>
// 								<td>
// 									<div className="flex items-center gap-3">
// 										<div>
// 											<div className="font-bold text-black">
// 												{data.store.name}
// 											</div>
// 											{/* <div className="text-sm opacity-50  text-black">
// 												{YMDW(new Date(data.createdAt))}
// 											</div> */}
// 										</div>
// 									</div>
// 								</td>
// 							</tr>
// 						))}
// 					</tbody>
// 					{/* foot */}
// 				</table>
// 			</div>
// 			<button
// 				type="button"
// 				className="btn btn-sm sm:btn-md bg-green02 rounded-full border-none w-2/3 mx-auto text-white"
// 				disabled={!selectStoreId}
// 				// onClick={() =>
// 				// 	handleInit({
// 				// 		userToken: userToken as string,
// 				// 		storeId: selectStoreId?.id as string,
// 				// 	})
// 				// }
// 			>
// 				ログイン
// 			</button>
// 		</>
// 	);
// };

// export default SelectStoreForm;
