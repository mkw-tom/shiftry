import type { JobRole } from "../../common/types/prisma.js";

export type GetJobRolesResponse = {
	ok: boolean;
	jobRoles: JobRole[];
};
