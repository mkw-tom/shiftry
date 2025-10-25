import { demoMembers } from "@/app/utils/dummyData/aiAdjustDemo";
import { dummyMembers } from "@/app/utils/dummyData/member";
import { TEST_MODE } from "@/lib/env";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type {
	Member,
	UserStoreLiteWithUserAndJobRoles,
} from "@shared/api/common/types/prismaLite";
import { add } from "date-fns";

type MembersState = {
	members: Member[];
};

const initialState: MembersState = {
	members: TEST_MODE ? demoMembers : [],
};

export const userSlice = createSlice({
	name: "members",
	initialState,
	reducers: {
		setMembers: (state, action: PayloadAction<Member[]>) => {
			state.members = action.payload;
		},
		addMember: (state, action: PayloadAction<Member>) => {
			state.members.push(action.payload);
		},
	},
});

export const { setMembers, addMember } = userSlice.actions;
export default userSlice.reducer;
