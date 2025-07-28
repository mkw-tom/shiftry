import type { JobRole } from "../../common/types/prisma";

export type GetJobRolesResponse = {
	ok: boolean;
	jobRoles: JobRole[];
};
