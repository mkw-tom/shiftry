import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Store } from "@shared/api/common/types/prisma";
import {
	StoreLite,
	type UserStoreLiteWithStore,
} from "@shared/api/common/types/prismaLite";

type StoresState = {
	stores: UserStoreLiteWithStore[];
};

const initialState: StoresState = {
	stores: [],
};

export const userSlice = createSlice({
	name: "stores",
	initialState,
	reducers: {
		setStores: (state, action: PayloadAction<UserStoreLiteWithStore[]>) => {
			state.stores = action.payload;
		},
		clearStores: (state) => {
			state.stores = [];
		},
	},
});

export const { setStores, clearStores } = userSlice.actions;
export default userSlice.reducer;
