import type { JobRole } from "../../common/types/prisma";

export type BulkUpsertJobRoleResponse = {
	ok: boolean;
	jobRoles: JobRole[];
};
