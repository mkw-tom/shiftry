import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { User } from "@shared/api/common/types/prisma";

type MembersState = {
	members: User[];
};

const initialState: MembersState = {
	members: [],
};

export const userSlice = createSlice({
	name: "members",
	initialState,
	reducers: {
		setMembers: (state, action: PayloadAction<User[]>) => {
			state.members = action.payload;
		},
	},
});

export const { setMembers } = userSlice.actions;
export default userSlice.reducer;
