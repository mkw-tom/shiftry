import type { parsePrioritiesFromAiInput } from "@shared/api/shift/ai/types/post-create.js";
import openai from "../../../../config/openai.js";

export const parsePrioritiesFromAi = async ({
	ownerRequests,
	submittedShifts,
}: parsePrioritiesFromAiInput): Promise<string> => {
	const prompt = `
    以下はオーナーからのシフト調整希望（自然言語）です。
    この内容をもとに、各スタッフに関する優先度データ（PriorityType[]）を**厳密な形式**で構造化してください。
    また、ownerRequests の内容をもとに、スタッフの希望や優先度を考慮して、整合性の取れたシフトを提案してください。加えて、ownerRequests の要素は、優先度の高い順に整列されています。

    # ✅ 入力データ構造
    ownerRequests: { text: string, weight: number }[]

    - \`text\`: スタッフに対する希望・調整内容が記載された自然言語です。
    - \`weight\`: 希望の強さを示す数値で、1〜3の整数です（3が最も強い希望）。

    # ✅ 出力形式（JSONのみ、注釈禁止）
    \`\`\`json
    [
      {
        "userId": "user-1",
        "userName": "高橋未来",
        "preferTime": "afternoon",
        "preferredDays": ["Monday", "Thursday"],
        "preferMoreThan": [
          { "userId": "user-2", "userName": "伊藤優子" }
        ],
        "weight": 3
      },
      ...
    ]
    \`\`\`

    # 🔍 各プロパティの意味とマッピングルール

    - **userId / userName**:
      - スタッフの識別情報です。必ず スタッフリスト から取得してください。

    - **preferTime**:
      - スタッフが希望する時間帯。以下のいずれかの形式を使用：
        - "morning" → 午前希望（例: 09:00〜12:00 など）
        - "afternoon" → 午後希望（例: 13:00〜18:00 など）
        - または明確な時間帯指定がある場合 → { "start": "HH:MM", "end": "HH:MM" }

    - **preferredDays**:
      - 「〇曜日がいい」「火・木中心で」などの表現に対応。曜日は "Monday"〜"Sunday" の英語表記で記述。

    - **preferMoreThan**:
      - 「〜より優先」「〜より多めに」などの比較指示に対して使用。
      - 対象となる userId / userName のペアを配列で含めてください。

    - **weight**:
      - ownerRequests の weight 値を反映してください。調整希望の強さを表します。
      - 明確に「最優先」「なるべく多く」などがある場合は 3、控えめな希望であれば 1〜2。

    ---

    # 👤 スタッフリスト（userId / userName 一覧）
    ${JSON.stringify(
			submittedShifts.map(({ userId, name }) => ({ userId, userName: name })),
			null,
			2,
		)}

    ---

    # 💬 オーナーの希望（自然言語 + weight）
    ${JSON.stringify(ownerRequests, null, 2)}

    ---

    # ✅ 出力ルール
    - JSON配列形式で返してください（PriorityType[]）
    - スタッフごとに必要なプロパティのみ含めてOK（すべて含める必要はありません）
    - 注釈、説明文、コードブロック外の文言は一切不要
`;

	const response = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: [
			{
				role: "system",
				content:
					"あなたはシフト作成AIです。ユーザーの調整希望を元に、希望や人数バランス、優先度情報を考慮し、整合性の取れたシフトを提案してください。",
			},
			{
				role: "user",
				content: prompt,
			},
		],
	});

	return response.choices[0].message?.content ?? "";
};
