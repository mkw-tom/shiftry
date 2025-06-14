// utils/token.ts
export const setTokenAndStoreToken = (userId: string, storeId: string) => {
	localStorage.setItem("token", userId);
	localStorage.setItem("store_token", storeId);
};

/// tokenからuserIdを取得
export const getToken = () => {
	const token = localStorage.getItem("token");
	if (!token) throw new Error("tokenが存在しません");
	return token;
};

export const getStoreToken = () => {
	const storeToken = localStorage.getItem("store_token");
	if (!storeToken) throw new Error("store_tokenが存在しません");
	return storeToken;
};

export const clearTokens = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("store_token");
};

/// store_tokenだけとりの像く
export const clearStoreToken = () => localStorage.removeItem("store_token");
