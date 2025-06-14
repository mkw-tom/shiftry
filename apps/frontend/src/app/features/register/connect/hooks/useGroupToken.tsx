"use client";
import { setGroupToken } from "@/app/redux/slices/token";
import type { AppDispatch } from "@/app/redux/store";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useGroupToken = () => {
	const searchParams = useSearchParams();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const groupToken = searchParams.get("group_token");
		if (groupToken) {
			dispatch(setGroupToken(groupToken));
		}
	}, [searchParams, dispatch]);
};
