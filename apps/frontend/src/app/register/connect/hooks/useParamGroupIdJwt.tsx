"use client";
import { useSearchParams } from "next/navigation";

export const useParamGroupIdJwt = () => {
	const searchParams = useSearchParams();
	return searchParams.get("groupId");
};
