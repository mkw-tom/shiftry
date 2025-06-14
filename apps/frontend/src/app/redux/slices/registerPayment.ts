// store/registerPaymentSlice.ts
import type { createPaymentType } from "@/app/features/dashboard/payment/validation/payment.validation";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type RegisterPaymentState = {
	name: string;
	email: string;
	productId: string;
	paymentMethodId: string;
};

const initialState: RegisterPaymentState = {
	name: "",
	email: "",
	productId: "",
	paymentMethodId: "",
};

export const registerPaymentSlice = createSlice({
	name: "registerPayment",
	initialState,
	reducers: {
		setProductId: (
			state,
			action: PayloadAction<Pick<createPaymentType, "productId">>,
		) => {
			state.productId = action.payload.productId;
		},
		setPaymentData: (
			state,
			action: PayloadAction<
				Pick<createPaymentType, "name" | "email" | "paymentMethodId">
			>,
		) => {
			state.name = action.payload.name;
			state.email = action.payload.email;
			state.paymentMethodId = action.payload.paymentMethodId;
		},
		resetPaymentData: () => initialState,
	},
});

export const { setProductId, setPaymentData, resetPaymentData } =
	registerPaymentSlice.actions;
export default registerPaymentSlice.reducer;
