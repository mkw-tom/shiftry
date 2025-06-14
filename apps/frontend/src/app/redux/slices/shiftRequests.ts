import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { ShiftRequest } from "@shared/common/types/prisma";

type shiftRequestsState = {
	shiftRequests: ShiftRequest[];
};

const initialState: shiftRequestsState = {
	shiftRequests: [],
};

export const userSlice = createSlice({
	name: "shiftRequests",
	initialState,
	reducers: {
		setShiftRequests: (state, action: PayloadAction<ShiftRequest[]>) => {
			state.shiftRequests = action.payload;
		},
		saveShiftRequest: (state, action: PayloadAction<ShiftRequest>) => {
			const index = state.shiftRequests.findIndex(
				(data) => data.id === action.payload.id,
			);
			if (index === -1) {
				state.shiftRequests.push(action.payload);
			} else {
				state.shiftRequests[index] = action.payload;
			}
		},
		clearShiftRequests: (state) => {
			state.shiftRequests = [];
		},
	},
});

export const { setShiftRequests, saveShiftRequest } = userSlice.actions;
export default userSlice.reducer;
