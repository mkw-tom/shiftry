import type { StaffPreference } from "@shared/api/common/types/prisma.js";
import type {
	StaffPreferenceDTO,
	WeeklyAvailabilityType,
} from "@shared/api/staffPreference/dto.js";

export const toStaffPreferenceDTO = (
	staffPreference: StaffPreference,
): StaffPreferenceDTO => {
	return {
		...staffPreference,
		weeklyAvailability:
			staffPreference.weeklyAvailability as WeeklyAvailabilityType,
	};
};

export const toStaffPreferencesDTO = (
	staffPreferences: StaffPreference[],
): StaffPreferenceDTO[] => {
	return staffPreferences.map((staffPreference) => ({
		...staffPreference,
		weeklyAvailability:
			staffPreference.weeklyAvailability as WeeklyAvailabilityType,
	}));
};
