// tests/utils/mockData.ts
import { faker } from "@faker-js/faker";
import type { User, UserRole } from "@shared/api/common/types/prisma";

export const createMockUserInput = (role: UserRole) => ({
	lineId: faker.string.uuid(),
	name: faker.person.fullName(),
	pictureUrl: faker.internet.url(),
	role: role,
});

// export const mockStaffUser: User = {
// 	id: faker.string.uuid(),
// 	lineId: faker.string.uuid(),
// 	name: faker.person.fullName(),
// 	pictureUrl: faker.datatype.boolean() ? faker.image.avatar() : null,
// 	role: "STAFF",
// 	createdAt: new Date(),
// 	updatedAt: new Date(),
// };

// export const mockOwnerUser: User = {
// 	id: faker.string.uuid(),
// 	lineId: faker.string.uuid(),
// 	name: faker.person.fullName(),
// 	pictureUrl: faker.datatype.boolean() ? faker.image.avatar() : null,
// 	role: "OWNER",
// 	createdAt: new Date(),
// 	updatedAt: new Date(),
// };
