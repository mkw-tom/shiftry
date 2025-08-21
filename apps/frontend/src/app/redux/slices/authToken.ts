// tokenSlice.ts
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type TokenState = { jwt: string | null }; // exp=UNIX(sec) 任意
const initialState: TokenState = { jwt: null };

const authTokenSlice = createSlice({
	name: "authToken",
	initialState,
	reducers: {
		setAuthToken: (state, a: PayloadAction<{ jwt: string; exp?: number }>) => {
			state.jwt = a.payload.jwt;
		},
		clearAuthToken: (state) => {
			state.jwt = null;
		},
	},
});

export const { setAuthToken, clearAuthToken } = authTokenSlice.actions;
export default authTokenSlice.reducer;
