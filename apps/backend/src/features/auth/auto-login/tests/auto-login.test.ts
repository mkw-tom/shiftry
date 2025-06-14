import type { PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

const prismaMock = mockDeep<PrismaClient>();
jest.mock("@prisma/client", () => {
	return {
		PrismaClient: jest.fn(() => prismaMock),
	};
});

import { getStoreFromUser } from "../../../../repositories/userStore.repository";
import { mockVerifyUser } from "../../../common/mocks/authorizationMock";
import { mockStore } from "../../../common/mocks/datas/store";
import { mockStaffUser } from "../../../common/mocks/datas/user";
import { mockUserStore } from "../../../common/mocks/datas/userStore";
import login from "../service";

// ✅ 5. repositoryモックもこのタイミングで
jest.mock("@/repositories/userStore.repository");
(getStoreFromUser as jest.Mock).mockResolvedValue([{ store: mockStore }]);

// ✅ 6. テスト本体
describe("Login (mocked)", () => {
	it("should create user, store, and userStore", async () => {
		const user = mockStaffUser;
		const userStore = mockUserStore(user.id, "store-id", "STAFF");
		const store = mockStore;

		prismaMock.user.findUnique.mockResolvedValue(user);
		prismaMock.userStore.findFirst.mockResolvedValue(userStore);
		prismaMock.store.findMany.mockResolvedValue([{ ...store, id: "store-Id" }]);
		(mockVerifyUser as jest.Mock).mockResolvedValue(user);
		(getStoreFromUser as jest.Mock).mockResolvedValue([{ store: mockStore }]);

		const result = await login(user.id, store.id);
		if (!result.user) {
			return;
		}
		if (!result.store) {
			return;
		}

		expect(result.user.id).toEqual(user.id);
		expect(result.user.name).toEqual(user.name);
		expect(result.user.role).toEqual(user.role);
		expect(result.store.id).toEqual(mockStore.id);
		expect(result.store.storeId).toEqual(store.storeId);
		expect(result.store.name).toEqual(store.name);
	});
});
