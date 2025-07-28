import type { UserJobRole } from "../../common/types/prisma";

export type BulkUpsertJobRolesResonse = {
	ok: boolean;
	userJobRoles: UserJobRole[];
};
