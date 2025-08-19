"use client";
import type { UserStoreLiteWithStore } from "@shared/api/common/types/prismaLite";
import React, { type SetStateAction, useState, type Dispatch } from "react";

const UnconnectedStoreList = ({
	unconnectedStores,
	selectStoreId,
	setSelectStoreId,
}: {
	unconnectedStores: UserStoreLiteWithStore[];
	selectStoreId: string | null;
	setSelectStoreId: Dispatch<SetStateAction<string | null>>;
}) => {
	return (
		<ul className="w-11/12 mx-auto mt-5 pb-3 border-b border-b-gray01">
			{unconnectedStores.map((store) => (
				<li key={store.storeId} className="px-4 py-2 flex items-center ">
					<input
						type="radio"
						className="radio radio-sm radio-success mr-3"
						checked={selectStoreId === store.storeId}
						onChange={(e) => setSelectStoreId(store.storeId)}
					/>
					<div className="flex justify-between items-center">
						<span className="">{store.store.name}</span>
					</div>
				</li>
			))}
		</ul>
	);
};

export default UnconnectedStoreList;
