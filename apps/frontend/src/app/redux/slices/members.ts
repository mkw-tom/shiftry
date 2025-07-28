import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { User, UserWithJobRole } from "@shared/api/common/types/prisma";

type MembersState = {
	members: UserWithJobRole[];
};

const initialState: MembersState = {
	members: [],
};

export const userSlice = createSlice({
	name: "members",
	initialState,
	reducers: {
		setMembers: (state, action: PayloadAction<UserWithJobRole[]>) => {
			state.members = action.payload;
		},
	},
});

export const { setMembers } = userSlice.actions;
export default userSlice.reducer;
