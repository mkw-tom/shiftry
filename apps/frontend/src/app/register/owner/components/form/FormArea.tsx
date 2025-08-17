"use client";
import { useAuth } from "@/shared/context/AuthProvider";
import React from "react";
import RegisterForm from "./RegisterForm";

const FormArea = () => {
	const { step } = useAuth();
	if (step === "unregistered") return <RegisterForm />;
	// return <RegisterForm />;
};

export default FormArea;
