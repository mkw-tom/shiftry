"use client";
import type { StateMode } from "@/app/lib/types/line-auth";
import { useSearchParams } from "next/navigation";

export const useDetectMode = (): StateMode => {
	const searchParams = useSearchParams();
	const state = searchParams.get("state");
	const mode = state?.split(":")[1];

	return mode === "login" ? "login" : "register";
};
