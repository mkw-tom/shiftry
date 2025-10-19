import fs from "node:fs";
import path from "node:path";
import type { Response } from "express";

export const testResponseService = (res: Response) => {
	// dist/環境でもsrc/のテストファイルを参照する
	const responsePath = path.resolve(
		process.cwd(),
		"src/features/shift/ai/adjust/test_values/test3_response.json",
	);
	console.log("test3_response.json path:", responsePath);
	if (!fs.existsSync(responsePath)) {
		res.status(500).json({
			ok: false,
			message: `Mock response file not found: ${responsePath}`,
		});
		return;
	}
	try {
		const raw = fs.readFileSync(responsePath, "utf-8");
		const mockResponse = JSON.parse(raw);
		res.status(200).json(mockResponse);
		return;
	} catch (e) {
		res
			.status(500)
			.json({ ok: false, message: `Failed to read mock response: ${e}` });
		return;
	}
};
