import { TEST_MODE, TEST_USER_ROLE } from "@/lib/env";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { User, UserRole } from "@shared/api/common/types/prisma";

type UserInfo = Pick<User, "id" | "name" | "pictureUrl"> & {
	role: UserRole | null;
};
type UserState = {
	user: UserInfo | null;
};

const initialState: UserState = {
	user: {
		id: TEST_MODE ? "user_001" : "",
		name: "",
		pictureUrl: "",
		role: "OWNER",
	},
};

export const UserSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<UserInfo>) => {
			state.user = action.payload;
		},
		setRegisterUserInfo: (state, action: PayloadAction<UserInfo>) => {
			if (state.user) {
				state.user.name = action.payload.name;
				state.user.pictureUrl = action.payload.pictureUrl;
			}
		},

		updateUserProfile: (state, action: PayloadAction<UserInfo>) => {
			if (state.user) {
				state.user.name = action.payload.name;
				state.user.pictureUrl = action.payload.pictureUrl;
			}
		},

		// changeUserRole: (state, action: PayloadAction<Pick<User, "role">>) => {
		// 	if (state.user) {
		// 		state.user.role = action.payload.role;
		// 	}
		// },

		clearUser: (state) => {
			state.user = null;
		},
	},
});

export const {
	setUser,
	setRegisterUserInfo,
	updateUserProfile,
	// changeUserRole,
	clearUser,
} = UserSlice.actions;
export default UserSlice.reducer;
