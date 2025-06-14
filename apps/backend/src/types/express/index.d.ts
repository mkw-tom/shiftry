import type { Request } from "express";

declare global {
	namespace Express {
		interface Request {
			userId?: string;
			storeId?: string;
			groupId?: string;
			lineId?: string;
		}
	}
}
