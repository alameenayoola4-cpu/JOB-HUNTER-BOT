const { normalizeJob } = require("../utils/parser");
const cron = require("cron");
const telegram = require("./telegram");
const indeed = require("./indeed");
const linkedin = require("./linkedin");
const remoteok = require("./remoteok");
const wework = require("./weworkremotely");
const gulf = require("./gulftalent");
const twitter = require("./twitter");
const { saveIfNew } = require("../utils/db");
const { isRelevantJob } = require("../utils/filters");

async function scan() {
  console.log("🔍 Fetching new jobs...");

  // Fetch jobs from all sources in parallel
  const sources = [
    indeed(),
    linkedin(),
    remoteok(),
    wework(),
    gulf(),
    twitter(),
  ];

  const results = (await Promise.all(sources)).flat();

  // Loop through each job, clean it, filter by keywords, save, and notify
  for (const job of results) {
    const cleaned = normalizeJob(job);

    if (isRelevantJob(cleaned.title)) {
      const isNew = saveIfNew(cleaned);
      if (isNew) telegram.sendJob(cleaned);
    }
  }

  console.log("✅ Scan complete.");
}

module.exports = {
  startHourlyJobScan() {
    console.log("⏰ Job scanning scheduled every hour.");

    // Cron job: runs at minute 0 every hour
    new cron.CronJob("0 * * * *", scan, null, true);
  },
};
