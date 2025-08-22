"use client";
import React from "react";
import type { FieldError } from "react-hook-form";

const RegisterStaffButton = ({
	isDisabled,
	loading,
}: { isDisabled:  boolean | FieldError| undefined; loading: boolean }) => {
	return (
		<button
			type="submit"
			className={`btn sm:btn-md ${
				isDisabled || loading
					? "bg-gray01 opacity-90 pointer-events-none"
					: " bg-green02"
			} rounded-md border-none w-11/12 mx-auto text-white mt-5 `}
			disabled={loading}
		>
			{loading ? <span className="loading loading-dots loading-sm" /> : "登録"}
		</button>
	);
};

export default RegisterStaffButton;
