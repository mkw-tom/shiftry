import type {
  Store,
  User,
  UserRole,
  UserStore,
} from "../../common/types/prisma";

export interface RegisterOwnerResponse {
  ok: true;
  user: { id: string; name: string };
  store: { id: string; name: string };
  userStore: { userId: string; storeId: string; role: UserRole };
}

export interface RegisterOwnerServiceResponse {
  user: { id: string; name: string };
  store: { id: string; name: string };
  userStore: { userId: string; storeId: string; role: UserRole };
}

export interface UpsertUserInput {
  name: string;
  pictureUrl?: string;
}

export interface UpsertUserRepositoryInputType {
  lineId_hash: string;
  lineId_enc: string;
  lineKeyVersion_hash: string;
  lineKeyVersion_enc: string;
  name: string;
  pictureUrl?: string;
}
