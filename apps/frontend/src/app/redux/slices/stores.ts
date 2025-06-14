import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Store } from "@shared/common/types/prisma";

type StoresState = {
	stores: Store[];
};

const initialState: StoresState = {
	stores: [],
};

export const userSlice = createSlice({
	name: "store",
	initialState,
	reducers: {
		setStores: (state, action: PayloadAction<Store[]>) => {
			state.stores = action.payload;
		},
		clearStores: (state) => {
			state.stores = [];
		},
	},
});

export const { setStores, clearStores } = userSlice.actions;
export default userSlice.reducer;
