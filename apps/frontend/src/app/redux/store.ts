// src/app/redux/store.ts
"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import activeShiftRequests from "./slices/activeShiftRequests"; // ← ファイル名は実態に合わせて
import authToken from "./slices/authToken";
import members from "./slices/members";
import payment from "./slices/payment";
import registerPayment from "./slices/registerPayment";
import store from "./slices/store";
import stores from "./slices/stores";
import user from "./slices/user";

const rootReducer = combineReducers({
	authToken,
	user,
	store,
	stores,
	payment,
	registerPayment,
	members,
	activeShiftRequests,
});

export const reduxStore = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
