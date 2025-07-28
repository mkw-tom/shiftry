import type { User } from "../../common/types/prisma";

export interface GetUsersFromStoreResponse {
  ok: true;
  storeUsers: UserWithJobRole[];
}

export type UserWithJobRole = {
  id: string;
  name: string;
  pictureUrl: string | null;
  jobRoles: {
    roleId: string;
    role: {
      id: string;
      name: string;
    };
  }[];
};
