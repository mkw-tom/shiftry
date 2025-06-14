"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { postlineAuth } from "../api/lineAuth";

export const useLineAuth = () => {
	const searchParams = useSearchParams();
	const [userLineInfo, setUserLineInfo] = useState<{
		userId: string;
		name: string;
		pictureUrl: string;
		line_token: string;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);
	const code = searchParams.get("code");

	useEffect(() => {
		if (!code || code === "undefined") {
			console.warn("LINEのcodeが取得できてません");
			return;
		}

		const fetchLineAuth = async () => {
			try {
				const res = await postlineAuth(code);

				if (!res.ok) {
					if ("errors" in res) {
						console.warn(res.message, res.errors);
						return;
					}
					console.error("エラー:", res.message);
					return;
				}

				const { userId, name, pictureUrl, line_token } = res;

				setUserLineInfo({ userId, name, pictureUrl, line_token });
			} catch (err) {
				console.error("LINEログイン失敗:", err);
				setError("LINEログインに失敗しました");
			}
		};

		fetchLineAuth();
	}, [code]);

	return { userLineInfo, error };
};
