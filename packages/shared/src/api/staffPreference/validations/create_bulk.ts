import z from "zod";
import { createStaffPreferenceValidation } from "./create.js";

export const createBulkStaffPreferenceValidation = z.array(
	createStaffPreferenceValidation,
);
export type CreateBulkStaffPreferenceInput = z.input<
	typeof createBulkStaffPreferenceValidation
>;
export type CreateBulkStaffPreference = z.infer<
	typeof createBulkStaffPreferenceValidation
>;
