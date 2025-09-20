import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { ShiftRequest } from "@shared/api/common/types/prisma";
import type { ShiftRequestDTO } from "@shared/api/shift/request/dto";

type ActiveShiftRequestsState = {
	activeShiftRequests: ShiftRequestDTO[];
};

const initialState: ActiveShiftRequestsState = {
	activeShiftRequests: [],
};

export const userSlice = createSlice({
	name: "activeShiftRequests",
	initialState,
	reducers: {
		setActiveShiftRequests: (
			state,
			action: PayloadAction<ShiftRequestDTO[]>,
		) => {
			state.activeShiftRequests = action.payload;
		},
		saveActiveShiftRequest: (state, action: PayloadAction<ShiftRequestDTO>) => {
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
