"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, reduxStore } from "./store";

const ReduxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<Provider store={reduxStore}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	);
};

export default ReduxProvider;
