export const parseAIJsonBlock = (aiOutput: string) => {
	try {
		// ```json\n...\n``` の囲みを除去
		const match = aiOutput.match(/```(?:json)?\n([\s\S]*?)```/);
		const cleaned = match ? match[1] : aiOutput;

		// JSON.parseを試みる
		const parsed = JSON.parse(cleaned);
		return parsed;
	} catch (error) {
		console.error("JSONのパースに失敗しました:", error);
		return null;
	}
};
