"use client";
import liff from "@line/liff";
import { useEffect, useState } from "react";

export const useLiffInit = (liffId: string) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const init = async () => {
			try {
				await liff.init({ liffId });
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "LIFFの初期化に失敗しました",
				);
			} finally {
				setLoading(false);
			}
		};
		init();
	}, [liffId]);

	return { loading, error };
};
