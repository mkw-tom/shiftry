import type { Store, User, UserRole } from "../../common/types/prisma.js";
import type { UserStoreLiteWithStore } from "../../common/types/prismaLite.js";

export type LoginResponseKindAuto = {
  ok: true;
  next: "AUTO";
  token: string;
};

export type LoginResponseKindSelect = {
  ok: true;
  next: "SELECT_STORE";
  stores: UserStoreLiteWithStore[];
};

export type LoginResponse = LoginResponseKindAuto | LoginResponseKindSelect;
