"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterStaffFormType, RegisterStaffFormValidate } from "../validation";

export const useRegisterStaffFormValidate = () => {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<RegisterStaffFormType>({
    resolver: zodResolver(RegisterStaffFormValidate),
    mode: "onChange",
  });

  const name = watch("name") ?? "";
  const storeCode = watch("storeCode") ?? "";
  const agree = watch("agree");
  const isDisabled =
    !agree || storeCode === "" || errors.agree || errors.storeCode || errors.name || name === "";

  return {
    register,
    handleSubmit,
    errors,
    isDisabled,
    storeCode,
    agree,
  };
};
