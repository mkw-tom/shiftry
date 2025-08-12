import type { UserJobRole } from "../../common/types/prisma.js";

export type BulkUpsertJobRolesResonse = {
	ok: boolean;
	userJobRoles: UserJobRole[];
};
