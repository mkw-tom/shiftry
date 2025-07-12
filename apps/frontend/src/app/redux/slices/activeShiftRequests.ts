import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { ShiftRequest } from "@shared/api/common/types/prisma";

type ActiveShiftRequestsState = {
	activeShiftRequests: ShiftRequest[];
};

const initialState: ActiveShiftRequestsState = {
	activeShiftRequests: [],
};

export const userSlice = createSlice({
	name: "shiftRequests",
	initialState,
	reducers: {
		setActiveShiftRequests: (state, action: PayloadAction<ShiftRequest[]>) => {
			state.activeShiftRequests = action.payload;
		},
		saveActiveShiftRequest: (state, action: PayloadAction<ShiftRequest>) => {
			const index = state.activeShiftRequests.findIndex(
				(data) => data.id === action.payload.id,
			);
			if (index === -1) {
				state.activeShiftRequests.push(action.payload);
			} else {
				state.activeShiftRequests[index] = action.payload;
			}
		},
		clearActiveShiftRequests: (state) => {
			state.activeShiftRequests = [];
		},
	},
});

export const { setActiveShiftRequests, saveActiveShiftRequest } =
	userSlice.actions;
export default userSlice.reducer;
