import type { RootState } from "@/redux/store";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "@shared/api/common/types/errors";
import type { GenerateShiftPdfResponse } from "@shared/api/pdf/types/shift";
import type { RawShiftJsonInput } from "@shared/api/pdf/validations/shift";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { pdfApi } from "../../path";
import { useFetch } from "../../useFetch";

export const useGenerateShiftPdf = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { jwt } = useSelector((state: RootState) => state.authToken);

	const generateShiftPdf = useCallback(
		async ({
			jsonData,
		}: {
			jsonData: RawShiftJsonInput;
		}): Promise<
			GenerateShiftPdfResponse | ErrorResponse | ValidationErrorResponse
		> => {
			setIsLoading(true);
			setError(null);
			try {
				if (!jwt) {
					setError("認証トークンが不足しています");
					throw new Error("認証トークンが不足しています");
				}

				const res = await useFetch<GenerateShiftPdfResponse>({
					jwt,
					method: "POST",
					path: pdfApi.shiftPdf,
					body: jsonData,
				});

				if (!res.ok) {
					setError("通信エラーが発生しました");
					return res;
				}

				return res;
			} catch (err) {
				setError("通信エラーが発生しました。");
				return {
					ok: false,
					message: err instanceof Error ? err.message : "Unknown error",
				};
			} finally {
				setIsLoading(false);
			}
		},
		[jwt],
	);

	return { generateShiftPdf, isLoading, error };
};
