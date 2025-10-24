"use client";
import liff from "@line/liff";
import React, { use, useState } from "react";
import { BiLock } from "react-icons/bi";
import { useConnectFormValidate } from "../hooks/useConnectFormValidate";
import { useConnectStore } from "../hooks/useConnectStore";
import type { connectFormType } from "../validation";
import ConnectButton from "./ConnectButton";

const ConnectForm = () => {
  const { register, errors, isDisabled, handleSubmit } =
    useConnectFormValidate();
  const { connectStore, connecting } = useConnectStore();

  const onSubmit = async (data: connectFormType) => {
    if (!data.agree) {
      return alert("同意にチェックを入れてください");
    }

    const res = await connectStore(data.storeCode);
    if (!res?.ok) {
      alert(`店舗の接続に失敗しました。もう一度お試しください。${res.message}`);
      liff.closeWindow();
      return;
    }

    if (res?.ok) {
      // kind: "ALREADY_LINKED" | "LINKED"
      const alertMessage =
        res.kind === "ALREADY_LINKED"
          ? "既にLINEグループと連携されています。"
          : "LINEグループとの連携が完了しました✨";
      alert(`${alertMessage}。店舗名：${res.store.name}`);
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
          <BiLock />
          店舗コード
        </legend>
        <input
          {...register("storeCode")}
          type="text"
          className="input input-bordered w-4/5 text-black bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-success text-center"
          placeholder="XXXX-XXXX-XXXX"
          maxLength={20}
          disabled={connecting}
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
            disabled={connecting}
          />
          <span className="text-xs text-black ">
            サービス利用のため、LINEグループの情報取得に同意します。
          </span>
        </label>
        {errors.agree && (
          <p className="fieldset-label text-error">{errors?.agree?.message}</p>
        )}
      </fieldset>
      <ConnectButton isDisabled={isDisabled} connecting={connecting} />
    </form>
  );
};

export default ConnectForm;
