import * as line from "@line/bot-sdk";
import { LINE_ACCESS_TOKEN } from "../lib/env.js";

const MessagingApiClient = line.messagingApi.MessagingApiClient;

const lineBot = new MessagingApiClient({
	channelAccessToken: `${LINE_ACCESS_TOKEN}`,
});

export default lineBot;
