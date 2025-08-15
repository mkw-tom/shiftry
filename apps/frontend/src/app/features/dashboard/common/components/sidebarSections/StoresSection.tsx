"use client";
import { useMystoresHooks } from "@/app/features/common/api/get-my-stores/hook";
import Skeleton from "@/app/features/common/components/Skeleton";
import type { RootState } from "@/app/redux/store";
import type { Store } from "@shared/api/common/types/prisma";
import Link from "next/link";
import React, { useState } from "react";
import { IoStorefrontOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const StoreSectionSkeleton = () => {
	return (
		<div className="text-center mt-4">
			<div className="loading loading-spinner loading-sm text-gray-400 mx-auto" />
			<p className="text-xs text-gray-500 mt-2">読み込み中...</p>
		</div>
	);
};

const StoresSection = () => {
	const { stores } = useSelector((state: RootState) => state.stores);
	const [isOpen, setIsOpen] = useState(false);
	const { error, isLoading } = useMystoresHooks(isOpen);

	return (
		<section className="w-full">
			<div className="collapse  collapse-arrow">
				<input type="checkbox" onChange={(e) => setIsOpen(e.target.checked)} />
				<div className="collapse-title text-black font-bold text-xs text-left flex items-center">
					<IoStorefrontOutline className="text-lg" />
					<span className="ml-2">所属してる店舗</span>
				</div>

				{isLoading && <StoreSectionSkeleton />}
				{!isLoading && (
					<div className="collapse-content">
						<ul className="h-52 scroll-auto">
							{stores.map((store) => (
								<li
									key={store.storeId}
									className="border-b border-gray01 h-8 mt-2"
								>
									<div className="flex justify-between items-center">
										<p className="text-black text-xs">{store.store.name}</p>
										<p className="badge badge-xs bg-green01 rounded-full font-bold border-none w-12 text-white">
											選択中
										</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</section>
	);
};

export default StoresSection;
