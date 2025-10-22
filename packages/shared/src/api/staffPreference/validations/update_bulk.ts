import z from "zod";
import { updateStaffPreferenceValidation } from "./update.js";

export const updateBulkStaffPreferenceValidation = z.array(
	updateStaffPreferenceValidation,
);
export type UpdateBulkStaffPreferenceInput = z.input<
	typeof updateBulkStaffPreferenceValidation
>;
export type UpdateBulkStaffPreference = z.infer<
	typeof updateBulkStaffPreferenceValidation
>;
