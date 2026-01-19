const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendMessage(chatId, text, options = {}) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text,
      parse_mode: options.parse_mode || "Markdown",
    });
  } catch (err) {
    console.error("Telegram send error:", err.message);
  }
}

async function sendJob(job) {
  const text = `
*New Job Found!*

*${escapeMarkdown(job.title)}*
Company: ${escapeMarkdown(job.company || "Unknown Company")}
Location: ${escapeMarkdown(job.location || "Worldwide")}
Source: ${escapeMarkdown(job.source)}

[Apply Here](${job.url})
`;

  await sendMessage(CHAT_ID, text, { parse_mode: "Markdown" });
}

function escapeMarkdown(text) {
  if (!text) return "";
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

module.exports = {
  sendMessage,
  sendJob,
};
