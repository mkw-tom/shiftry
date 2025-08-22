"use client";
import liff from "@line/liff";
import React, { use, useState } from "react";
import { BiLock } from "react-icons/bi";
import ConnectButton from "./ConnectButton";
import { LuUser } from "react-icons/lu";
import { useRegisterStaff } from "../hook/useRegisterStaff";
import useRegisterOwnerFormValidate from "../../owner/hooks/useRegisterOwnerValidate";
import { RegisterStaffFormType } from "../validation";
import { useRegisterStaffFormValidate } from "../hook/useRegisterStaffFormValidate";

const RegisterStaffForm = () => {
  const { register, errors, isDisabled, handleSubmit } =
    useRegisterStaffFormValidate();
  const { error, registerStaff, loading } = useRegisterStaff();

  const onSubmit = async (data: RegisterStaffFormType) => {
    if (!data.agree) {
      return alert("同意にチェックを入れてください");
    }

    const res = await registerStaff(data.name, data.storeCode);
    if ("ok" in res && !res.ok) {
      alert(`店舗の接続に失敗しました。もう一度お試しください。${res.message}`);
      liff.closeWindow();
      return;
    }

    if ("ok" in res && res.ok) {
      alert(`LINEグループ連携が完了しました✨。店舗名：${res.store.name}`);
      liff.closeWindow();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 mt-5 w-11/12 mx-auto"
    >
      <fieldset className="fieldset w-full mx-auto flex flex-col items-center">
        <legend className="fieldset-legend text-gray02 text-center">
          <LuUser />
          スタッフ名
        </legend>
        <input
          {...register("name")}
          type="text"
          className="input input-bordered w-4/5 text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-success"
          placeholder="例：シフト太郎"
          maxLength={10}
          disabled={loading}
        />
        <p className="fieldset-label text-gray02">
          ※ プライバシー保護のため、フルネームは避けてください。
        </p>
        {errors.name && (
          <p className="fieldset-label text-error">{errors.name.message}</p>
        )}
      </fieldset>

      <fieldset className="fieldset w-full mx-auto flex flex-col items-center">
        <legend className="fieldset-legend text-gray02 text-center">
          <BiLock />
          店舗コード
        </legend>
        <input
          {...register("storeCode")}
          type="text"
          className="input input-bordered w-4/5 text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-success text-center"
          placeholder="XXXX-XXXX-XXXX"
          maxLength={14}
          disabled={loading}
        />
        {errors.storeCode && (
          <p className="fieldset-label text-error">
            {errors.storeCode.message}
          </p>
        )}
      </fieldset>

      <fieldset className="fieldset w-full mx-auto flex flex-col items-center">
        <label className="fieldset-label w-11/12 mx-auto">
          <input
            {...register("agree")}
            type="checkbox"
            defaultChecked={false}
            className="checkbox checkbox-sm checkbox-success mb-3 sm:mb-1"
            disabled={loading}
          />
          <span className="text-xs text-black ">
            サービス利用のため、LINEグループの情報取得に同意します。
          </span>
        </label>
        {errors.agree && (
          <p className="fieldset-label text-error">{errors?.agree?.message}</p>
        )}
      </fieldset>
      <ConnectButton isDisabled={isDisabled} loading={loading} />
    </form>
  );
};

export default RegisterStaffForm;
