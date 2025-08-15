import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Store } from "@shared/api/common/types/prisma";

type StoreState = {
	store: Pick<Store, "id" | "name" | "isActive"> | null;
};

const initialState: StoreState = {
	store: null,
};

export const userSlice = createSlice({
	name: "store",
	initialState,
	reducers: {
		// 全体セット
		setStore: (
			state,
			action: PayloadAction<Pick<Store, "id" | "name" | "isActive">>,
		) => {
			state.store = action.payload;
		},

		// 一部更新（プロフィール）
		updateStoreName: (state, action: PayloadAction<Pick<Store, "name">>) => {
			if (state.store) {
				state.store.name = action.payload.name;
			}
		},

		// ログアウトなどでリセット
		clearStore: (state) => {
			state.store = null;
		},
	},
});

export const { setStore, updateStoreName, clearStore } = userSlice.actions;
export default userSlice.reducer;
