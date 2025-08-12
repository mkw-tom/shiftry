import { faker } from "@faker-js/faker";
import type { Store } from "@shared/api/common/types/prisma.js";

export const createMockStoreInput = () => ({
	name: faker.company.name(),
	groupId: faker.string.uuid(),
});

// export const mockStore: Store = {
// 	id: faker.string.uuid(),
// 	name: faker.company.name(),
// 	groupId: faker.string.nanoid(),
// 	createdAt: new Date(),
// 	updatedAt: new Date(),
// };
