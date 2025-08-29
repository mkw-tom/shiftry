// import type { RegisterPositionFormInput } from "@shared/api/shiftPosition/validations/put-bulk";
import type { UpsertShiftPositionBaseInput } from "@shared/api/shiftPosition/validations/put-bulk";
import React from "react";
import { type Control, type UseFormSetValue, useWatch } from "react-hook-form";

const CountInput = ({
	setValue,
	control,
}: {
	setValue: UseFormSetValue<UpsertShiftPositionBaseInput>;
	control: Control<UpsertShiftPositionBaseInput>;
}) => {
	const count = useWatch({ control, name: "count" }) ?? 1;

	const inc = () =>
		setValue("count", count + 1, { shouldDirty: true, shouldValidate: true });
	const dec = () =>
		setValue("count", Math.max(1, count - 1), {
			shouldDirty: true,
			shouldValidate: true,
		});
	return (
		<div className="flex flex-col items-start">
			<h3 className="text-sm text-gray-600">人数</h3>
			<div className="flex items-center h-11 gap-1">
				<button
					type="button"
					onClick={dec}
					className="btn btn-sm btn-circle btn-success w-5 h-5 px-0"
				>
					−
				</button>

				{/* ここはただの表示。hidden は不要 */}
				<span className="mx-2 text-black">{count}</span>

				<button
					type="button"
					onClick={inc}
					className="btn btn-sm btn-circle btn-success w-5 h-5 px-0"
				>
					＋
				</button>
			</div>
		</div>
	);
};

export default CountInput;
