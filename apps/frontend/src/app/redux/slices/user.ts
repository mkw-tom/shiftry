import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { User } from "@shared/api/common/types/prisma";

type UserState = {
  user: Pick<User, "id" | "lineId" | "name" | "pictureUrl" | "role"> | null;
};

const initialState: UserState = {
  user: {
    id: "",
    lineId: "",
    name: "",
    pictureUrl: "",
    role: "OWNER",
  },
};

export const UserSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
		setRegisterUserInfo: (
			state,
			action: PayloadAction<Pick<User, "lineId" | "pictureUrl" | "role">>,
		) => {
			if (state.user) {
				// state.user.name = action.payload.name;
				state.user.lineId = action.payload.lineId;
				state.user.pictureUrl = action.payload.pictureUrl;
				state.user.role = action.payload.role;
			}
		},

		updateUserProfile: (
			state,
			action: PayloadAction<Pick<User, "name" | "pictureUrl">>,
		) => {
			if (state.user) {
				state.user.name = action.payload.name;
				state.user.pictureUrl = action.payload.pictureUrl;
			}
		},

		changeUserRole: (state, action: PayloadAction<Pick<User, "role">>) => {
			if (state.user) {
				state.user.role = action.payload.role;
			}
		},

		clearUser: (state) => {
			state.user = null;
		},
	},
});

export const {
	setUser,
	setRegisterUserInfo,
	updateUserProfile,
	changeUserRole,
	clearUser,
} = UserSlice.actions;
export default UserSlice.reducer;
