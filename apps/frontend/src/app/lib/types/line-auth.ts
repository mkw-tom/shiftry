import type { UserRole } from "@shared/common/types/prisma";
export type StateRole = Extract<UserRole, "OWNER" | "STAFF">;

export type StateMode = "register" | "login";
