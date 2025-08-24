import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type {
	Member,
	UserStoreLiteWithUserAndJobRoles,
} from "@shared/api/common/types/prismaLite";

type MembersState = {
	members: Member[];
};

const initialState: MembersState = {
	members: [],
};

export const userSlice = createSlice({
	name: "members",
	initialState,
	reducers: {
		setMembers: (state, action: PayloadAction<Member[]>) => {
			state.members = action.payload;
		},
	},
});

export const { setMembers } = userSlice.actions;
export default userSlice.reducer;
