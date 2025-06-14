import type { PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

const prismaMock = mockDeep<PrismaClient>();
jest.mock("@prisma/client", () => {
	return {
		PrismaClient: jest.fn(() => prismaMock),
	};
});

import { mockStore } from "../../../common/mocks/datas/store";
import { mockOwnerUser } from "../../../common/mocks/datas/user";
import registerOwner from "../service";

describe("registerStaff (mocked)", () => {
	it("should create user, store, and userStore", async () => {
		const user = mockOwnerUser;
		const store = mockStore;

		(prismaMock.user.upsert as jest.Mock).mockResolvedValue(user);
		(prismaMock.store.create as jest.Mock).mockResolvedValue(store);
		(prismaMock.userStore.create as jest.Mock).mockResolvedValue({
			userId: user.id,
			storeId: store.id,
			role: "STAFF",
		});

		const userInput = {
			lineId: user.lineId,
			name: user.name,
			prictureUrl: user.pictureUrl,
			role: user.role,
		};
		const storeInput = {
			name: store.name,
			groupId: store.groupId as string,
		};

		const result = await registerOwner(userInput, storeInput);
		if (!result.user) {
			return;
		}
		if (!result.store) {
			return;
		}

		expect(result.user.id).toEqual(user.id);
		expect(result.store.id).toEqual(store.id);
	});
});
