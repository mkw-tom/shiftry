import type z from "zod";
import { StaffPreferenceDTOValidate } from "../dto.js";

// put用: createdAt, updatedAtは不要
export const updateStaffPreferenceValidation = StaffPreferenceDTOValidate.omit({
	userId: true,
	storeId: true,
	createdAt: true,
	updatedAt: true,
});

export type UpdateStaffPreferenceInput = z.input<
	typeof updateStaffPreferenceValidation
>;
export type UpdateStaffPreference = z.infer<
	typeof updateStaffPreferenceValidation
>;
