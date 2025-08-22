import { useCallback, useState } from "react";
import { postRegisterStaff } from "../api/postRegisterStaff";
import liff from "@line/liff";
import { userInputType } from "@shared/api/auth/validations/register-staff";
import { RegisterStaffResponse } from "@shared/api/auth/types/register-staff";
import { ErrorResponse } from "@shared/api/common/types/errors";

export const useRegisterStaff = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const registerStaff = useCallback(async (
    staffName: string,
    storeCode: string
  ): Promise<RegisterStaffResponse | ErrorResponse | PaymentValidationErrors> => {
    setLoading(true);
    setError(null);

    try {
      const idToken = liff.getIDToken();
      if (!idToken) throw new Error("ID Token not found");
      const profile = await liff.getProfile().catch(() => null);
      if (!profile || !profile.pictureUrl)
        throw new Error("Profile not found");

      const userInput: userInputType = { name: staffName, pictureUrl: profile.pictureUrl };
      const response = await postRegisterStaff({
        idToken,
        storeCode,
        userInput,
      });

      if (!("ok" in response) || response.ok !== true) {
        return { ok: false, message: response.message};
      }

      return response
    } catch (e) {
      const msg = e instanceof Error ? e.message : "不明なエラーが発生しました";
      setError(msg);
      return { ok: false, message: msg };
    } finally {
      setLoading(false);
    }
  },[]);

  return { registerStaff, error, loading };
}