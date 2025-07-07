import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Store } from "@shared/api/common/types/prisma";

type UserState = {
	store: Store | null;
};

const initialState: UserState = {
	store: null,
};

export const userSlice = createSlice({
	name: "store",
	initialState,
	reducers: {
		// 全体セット
		setStore: (state, action: PayloadAction<Store>) => {
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
