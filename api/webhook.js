const { sendMessage } = require("../services/telegram");

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const update = req.body;

        // Handle incoming messages
        if (update.message) {
            const chatId = update.message.chat.id;
            const text = update.message.text || "";

            if (text === "/start") {
                await sendMessage(
                    chatId,
                    `*Welcome to Job Hunter Bot!*\n\n` +
                    `I'll send you relevant job postings every morning at 8:00 AM UTC.\n\n` +
                    `*Sources I check:*\n` +
                    `- RemoteOK\n` +
                    `- Remotive\n` +
                    `- Arbeitnow\n` +
                    `- WeWorkRemotely\n` +
                    `- TheMuse\n` +
                    `- Himalayas\n` +
                    `- Reddit\n` +
                    `- HackerNews\n\n` +
                    `Stay tuned for opportunities!`,
                    { parse_mode: "Markdown" }
                );
            } else if (text === "/status") {
                await sendMessage(
                    chatId,
                    `Bot is active and running!\n\nNext scan: 8:00 AM UTC tomorrow`,
                    { parse_mode: "Markdown" }
                );
            } else {
                await sendMessage(
                    chatId,
                    `Job Hunter Bot is active!\n\n` +
                    `Commands:\n` +
                    `/start - Welcome message\n` +
                    `/status - Check bot status`,
                    { parse_mode: "Markdown" }
                );
            }
        }

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return res.status(500).json({ error: error.message });
    }
}
