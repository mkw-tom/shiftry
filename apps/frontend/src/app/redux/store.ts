"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import members from "./slices/members";
import payment from "./slices/payment";
import registerPayment from "./slices/registerPayment";
import shiftReuqests from "./slices/shiftRequests";
import store from "./slices/store";
import stores from "./slices/stores";
import user from "./slices/user";

import { persistReducer, persistStore } from "redux-persist";
import storage from "../lib/storage";
import tokenReducer from "./slices/token";

const rootReducer = combineReducers({
	token: tokenReducer,
	user: user,
	store: store,
	stores: stores,
	payment: payment,
	registerPayment: registerPayment,
	members: members,
	shiftReuqests: shiftReuqests,
});

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["token"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const reduxStore = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }),
});
export const persistor = persistStore(reduxStore);

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
