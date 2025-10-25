import type z from "zod";
import { StaffPreferenceDTOValidate } from "../dto.js";

export const updateStaffPreferenceValidation = StaffPreferenceDTOValidate.omit({
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
