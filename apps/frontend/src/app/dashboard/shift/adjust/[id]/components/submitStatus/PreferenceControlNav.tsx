import { useBulkUpdateStaffPreference } from "@/app/api/hook/staffPreference/useBulkUpdateStaffPreference";
import { TEST_MODE } from "@/lib/env";
import type { UpdateBulkStaffPreferenceInput } from "@shared/api/staffPreference/validations/update_bulk";
import React from "react";
import { useAdjustShiftForm } from "../../context/AdjustShiftFormContextProvider.tsx";

const PreferenceControlNav = ({
	openStaffPreferenceModal,
}: {
	openStaffPreferenceModal: (userId?: string, userName?: string) => void;
}) => {
	const { staffPreferences } = useAdjustShiftForm();
	const { bulkUpdateStaffPreference } = useBulkUpdateStaffPreference();

	const handlebulkUpdateStaffPreference = async () => {
		try {
			if (TEST_MODE)
				return alert("データの保存が完了しました！テストモード！！");
			const formData: UpdateBulkStaffPreferenceInput = staffPreferences.map(
				(pref) => ({
					userId: pref.userId,
					weekMin: pref.weekMin,
					weekMax: pref.weekMax,
					weeklyAvailability: pref.weeklyAvailability,
					note: pref.note ?? null,
				}),
			);

			const res = await bulkUpdateStaffPreference({ formData });
			if (res.ok) {
				console.log("Bulk update successful");
				alert("スタッフ希望情報を更新しました");
			} else {
				alert(`スタッフ基本希望の更新に失敗しました: ${res.message}`);
			}
		} catch (error) {
			console.error("Error bulk updating staff preferences:", error);
		}
	};

	return (
		<div className="flex gap-2 items-center mb-2 justify-start">
			<button
				type="button"
				className="btn btn-sm bg-base text-gray-700 border-gray01 shadow-sm"
				onClick={() => openStaffPreferenceModal()}
			>
				メンバー手動追加
			</button>
			<button
				type="button"
				className="btn btn-sm btn-success shadow-sm"
				onClick={handlebulkUpdateStaffPreference}
			>
				編集を保存
			</button>
		</div>
	);
};

export default PreferenceControlNav;
