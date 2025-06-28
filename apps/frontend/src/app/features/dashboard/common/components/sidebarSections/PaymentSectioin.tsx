"use client";
import { useMyPaymentHook } from "@/app/features/common/api/get-my-payment/hook";
import Skeleton from "@/app/features/common/components/Skeleton";
import { RootState } from "@/app/redux/store";
import React, { useState } from "react";
import { AiOutlinePayCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import PaymentSectionContent from "./PaymentSectionContent";

const PaymentSectionSkeleton = () => (
	<div className="collapse-content">
		<div className="mx-5 mt-4 mb-6">
			<Skeleton width="w-12" height="h-5" rounded="rounded-full" />
			<div className="mt-4 text-center mx-auto flex justify-center">
				<Skeleton width="w-24" height="h-6" rounded="" />
			</div>

			<div className="text-black text-center text-xs mt-3 flex justify-center">
				<Skeleton width="w-10/12" height="h-2" rounded="rounded-full" />
			</div>
			<div className="mt-3">
				<Skeleton width="w-full" height="h-6" rounded="rounded-full" />
			</div>
		</div>
	</div>
);

const PaymentSectioin = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { isLoading, error } = useMyPaymentHook(isOpen);
	return (
		<section className="w-full">
			<div className="collapse collapse-arrow">
				<input type="checkbox" onChange={(e) => setIsOpen(e.target.checked)} />
				<div className="collapse-title text-black font-bold text-xs text-left flex items-center">
					<AiOutlinePayCircle className="text-lg" />
					<span className="ml-2">お支払い情報</span>
				</div>
				{isLoading && <PaymentSectionSkeleton />}
				{!isLoading && <PaymentSectionContent />}
			</div>
		</section>
	);
};

export default PaymentSectioin;
