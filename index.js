require("dotenv").config();
const bot = require("./services/telegram");
const jobFetcher = require("./services/jobFetcher");

bot.start();
jobFetcher.startHourlyJobScan();