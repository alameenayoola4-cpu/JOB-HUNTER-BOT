const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

module.exports = {
  start() {
    bot.on("message", (msg) => {
      bot.sendMessage(msg.chat.id, "Job Hunter Bot is active! 🔍");
    });
  },

  sendJob(job) {
    const text = `
🚀 *New Job Found!*

*${job.title}*
📌 ${job.company || "Unknown Company"}
🌍 ${job.location || "Worldwide"}

🔗 Apply: ${job.url}
`;

    bot.sendMessage(process.env.CHAT_ID, text, { parse_mode: "Markdown" });
  },
};
