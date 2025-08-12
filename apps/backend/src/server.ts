dotenv.config();
import dotenv from "dotenv";
import app from "./app.js";
import { PORT } from "./lib/env.js";

const port = PORT || 3000;

app.listen(port, () => {
	console.log(`🚀 Server running on port ${port}`);
});
