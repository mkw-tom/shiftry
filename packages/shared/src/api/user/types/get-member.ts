import type { UserStoreLiteWithUserAndJobRoles } from "../../../api/common/types/prismaLite.js";

export interface GetMemberFromStoreResponse {
	ok: true;
	members: UserStoreLiteWithUserAndJobRoles[];
}

// export type UserWithJobRole = {
// 	id: string;
// 	name: string;
// 	role: UserRole
// 	pictureUrl: string | null;
// 	jobRoles: {
// 		roleId: string;
// 		role: {
// 			id: string;
// 			name: string;
// 		};
// 	}[];
// };
