import type { JobRole } from "../../common/types/prisma.js";

export type BulkUpsertJobRoleResponse = {
	ok: boolean;
	jobRoles: JobRole[];
};
