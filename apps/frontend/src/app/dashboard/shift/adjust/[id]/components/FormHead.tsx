"use client";
import { useToast } from "@/app/dashboard/common/context/ToastProvider";
import { useRouter } from "next/navigation";
import React from "react";

const FormHead = () => {
	return (
		<div className="w-full mx-auto pt-5 border-b border-gray01 pb-1 flex items-center px-3">
			<h2 className="text-green02 font-bold text-sm ">シフト調整</h2>
			<button
				type="button"
				className="btn btn-sm btn-link text-gray-500 ml-auto"
			>
				下書き保存
			</button>
		</div>
	);
};

export default FormHead;
