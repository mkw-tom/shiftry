import type { Request } from "express";

declare global {
	namespace Express {
		interface Request {
			userId?: string;
			storeId?: string;
			groupId?: string;
			lineId?: string;
			auth?: {
				uid?: string;
				sid?: string;
				role?: import("@shared/api/common/types/prisma").UserRole;
				iat?: number;
				exp?: number;
			};
			channelType: "group" | "room" | "utou";
			idToken?: string;
		}
	}
}
