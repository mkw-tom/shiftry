"use client";
import type { RootState } from "@/redux/store";
import type { UserRole } from "@shared/api/common/types/prisma";
import React from "react";
import { useSelector } from "react-redux";
import PageBackButton from "../../common/components/PageBackButton";

const FormHead = () => {
	return (
		<div className="flex items-center gap-3 py-3 px-3 border-b border-gray01">
			<PageBackButton />
			<span className="text-green02 font-bold w-full text-center text-sm">
				過去のシフト履歴
			</span>
		</div>
	);
};

export default FormHead;
