import { useNavigation } from "@/app/lib/navigation";
import { setShiftRequests } from "@/app/redux/slices/shiftRequests";
import { setStore } from "@/app/redux/slices/store";
import { setGroupToken, setStoreToken } from "@/app/redux/slices/token";
import type { AppDispatch } from "@/app/redux/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { init } from "../api/init";

export const useInit = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const searchParams = useSearchParams();
	const router = useRouter();
	const shiftRequestId = searchParams.get("shiftRequestId");

	const handleInit = async ({
		userToken,
		storeId,
	}: {
		userToken: string;
		storeId: string;
	}) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await init({ userToken, storeId });
			if (!res.ok) {
				if ("errors" in res) {
					setError("通信エラーが発生しました");
					console.warn(res.message, res.errors);
					return;
				}
				setError("通信エラーが発生しました");
				console.warn("エラー:", res.message);
				return;
			}

			dispatch(setStore(res.store));
			dispatch(setShiftRequests(res.shiftRequests));
			dispatch(setGroupToken(res.group_token));
			dispatch(setStoreToken(res.store_token));
			if(shiftRequestId) {
				router.replace(`/dashboard?shiftRequestId=${shiftRequestId}`);
				return 
			}
			return router.replace("/dashboard");
		} catch (err) {
			setError("通信エラーが発生しました。");
			console.warn("エラー:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return { handleInit, isLoading, error };
};
