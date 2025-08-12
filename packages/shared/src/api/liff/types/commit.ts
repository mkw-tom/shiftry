import { UserRole } from "../../../api/common/types/prisma";

export type CommitLiffUserResponse = {
  token: string;
  user: { id: string; role: UserRole };
  storeId: string | null;
};
