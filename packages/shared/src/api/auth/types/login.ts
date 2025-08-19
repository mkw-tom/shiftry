import type { Store, User, UserRole } from "../../common/types/prisma.js";
import type {
  StoreLite,
  UserLite,
  UserStoreLiteWithStore,
} from "../../common/types/prismaLite.js";

export type LoginResponseKindAuto = {
  ok: true;
  kind: "AUTO";
	token: string;
};

export type LoginResponseKindSelect = {
  ok: true;
  kind: "SELECT_STORE";
  stores: UserStoreLiteWithStore[];
};

export type LoginResponse =
  | LoginResponseKindAuto
  | LoginResponseKindSelect;

export type NextKind =
  | { next: "AUTO"; storeId: string }
  | { next: "SELECT_STORE" };
