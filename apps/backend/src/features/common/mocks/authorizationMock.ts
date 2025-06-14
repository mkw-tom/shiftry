// tests/mocks/authorizationMock.ts
export const mockVerifyUser = jest.fn();

jest.mock("@features/common/authorization.service", () => ({
	...jest.requireActual("@/features/common/authorization.service"),
	verifyUser: mockVerifyUser,
}));
