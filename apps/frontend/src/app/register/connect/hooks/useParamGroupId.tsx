"use client";
import { useSearchParams } from "next/navigation";

export const useParamGroupId = () => {
	const searchParams = useSearchParams();
	return searchParams.get("groupId");
};
