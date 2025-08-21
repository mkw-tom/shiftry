import { lineMessageChannel } from "../../../../lib/env.js";

export async function pushToUser(lineUserId: string, text: string) {
  const r = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lineMessageChannel.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: lineUserId,
      messages: [{ type: "text", text }],
    }),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`LINE push failed: ${r.status} ${t}`);
  }
}