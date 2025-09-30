import React from "react";
import { BiCheck, BiCheckCircle } from "react-icons/bi";
import { BiError } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const Toast = ({
	text,
	success,
	error,
}: {
	text: string;
	success?: boolean;
	error: boolean;
}) => {
	if (success) {
		return (
			<div className="toast fixed bottom-4 right-2 z-50">
				<div className="alert alert-success flex items-center gap-2">
					<BiCheck className="text-black opacity-70" />
					{/* <IoMdCheckmarkCircleOutline className="text-black opacity-70" /> */}
					<span>{text}</span>
				</div>
			</div>
		);
	}
	if (error) {
		return (
			<div className="toast fixed bottom-4 right-2 z-50">
				<div className="alert alert-error flex items-center gap-2">
					<BiError className="text-black opacity-70" />
					<span>{text}</span>
				</div>
			</div>
		);
	}
};

export default Toast;
