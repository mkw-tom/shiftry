"use client";
import type { StateRole } from "@/app/lib/types/line-auth";
import { useSearchParams } from "next/navigation";

export const useDetectRole = (): StateRole => {
	const searchParams = useSearchParams();
	const state = searchParams.get("state");
	const role = state?.split(":")[0];
	return role === "STAFF" ? "STAFF" : "OWNER";
};
