import type {
	RegisterOwnerServiceResponse,
	UpsertUserInput,
} from "@shared/api/auth/types/register-owner";
import type { StoreNameType } from "@shared/api/auth/validations/register-owner";
import { createStore } from "../../../repositories/store.repository";
import { upsertUser } from "../../../repositories/user.repository";
import { createUserStore } from "../../../repositories/userStore.repository";

const registerOwner = async (
	userInput: UpsertUserInput,
	storeInput: StoreNameType,
): Promise<RegisterOwnerServiceResponse> => {
	const user = await upsertUser(userInput);
	const store = await createStore(storeInput.name);
	const userStore = await createUserStore(user.id, store.id, "OWNER");

	return { user, store, userStore };
};

export default registerOwner;
