import dotenv from "dotenv";

// `NODE_ENV` に応じて適用する `.env` ファイルを決定
const envFile =
	process.env.NODE_ENV === "test" ? ".env.test" : ".env.production";
dotenv.config({ path: envFile });

console.log(`🚀 Using ${envFile} configuration`);

export const DATABASE_URL = process.env.DATABASE_URL || "";
