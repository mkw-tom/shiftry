import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Payment } from "@shared/api/common/types/prisma";

type PaymentState = {
	Payment: Payment | null;
};

const initialState: PaymentState = {
	Payment: null,
};

export const userSlice = createSlice({
	name: "Payment",
	initialState,
	reducers: {
		setPayment: (state, action: PayloadAction<Payment>) => {
			state.Payment = action.payload;
		},
	},
});

export const { setPayment } = userSlice.actions;
export default userSlice.reducer;
