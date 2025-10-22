import type z from "zod";
import { StaffPreferenceDTOValidate } from "../dto.js";

// create用: createdAt, updatedAtは不要
export const createStaffPreferenceValidation = StaffPreferenceDTOValidate.omit({
	createdAt: true,
	updatedAt: true,
});

export type CreateStaffPreferenceInput = z.input<
	typeof createStaffPreferenceValidation
>;
export type CreateStaffPreference = z.infer<
	typeof createStaffPreferenceValidation
>;
