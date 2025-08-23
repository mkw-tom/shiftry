import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { UserStoreLiteWithUserAndJobRoles } from "@shared/api/common/types/prismaLite";

type MembersState = {
	members: UserStoreLiteWithUserAndJobRoles[];
};

const initialState: MembersState = {
	members: [],
};

export const userSlice = createSlice({
	name: "members",
	initialState,
	reducers: {
		setMembers: (
			state,
			action: PayloadAction<UserStoreLiteWithUserAndJobRoles[]>,
		) => {
			state.members = action.payload;
		},
	},
});

export const { setMembers } = userSlice.actions;
export default userSlice.reducer;
