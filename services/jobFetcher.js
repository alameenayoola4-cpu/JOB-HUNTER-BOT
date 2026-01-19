const { normalizeJob } = require("../utils/parser");

// Primary job sources - reliable APIs
const remoteok = require("./remoteok");
const remotive = require("./indeed"); // Remotive API
const arbeitnow = require("./linkedin"); // Arbeitnow API
const wework = require("./weworkremotely"); // RSS feed
const themuse = require("./gulftalent"); // TheMuse API
const himalayas = require("./twitter"); // Himalayas API

// Additional job sources
const startupjobs = require("./startupjobs");
const joboard = require("./joboard");
const hackernews = require("./hackernews");
const reddit = require("./reddit");

const { saveIfNew } = require("../utils/db");
const { isRelevantJob } = require("../utils/filters");

async function fetchAllJobs() {
  console.log("Fetching new jobs from all platforms...");

  // Fetch jobs from all sources in parallel
  const sources = [
    // Primary sources (most reliable)
    { name: "RemoteOK", fn: remoteok },
    { name: "Remotive", fn: remotive },
    { name: "Arbeitnow", fn: arbeitnow },
    { name: "WeWorkRemotely", fn: wework },
    { name: "TheMuse", fn: themuse },
    { name: "Himalayas", fn: himalayas },
    // Additional sources
    { name: "StartupJobs", fn: startupjobs },
    { name: "JoBoard", fn: joboard },
    { name: "HackerNews", fn: hackernews },
    // Social/Community sources
    { name: "Reddit", fn: reddit },
  ];

  const results = await Promise.all(
    sources.map(async (source) => {
      try {
        const jobs = await source.fn();
        console.log(`[OK] ${source.name}: ${jobs.length} jobs fetched`);
        return jobs;
      } catch (err) {
        console.error(`[FAIL] ${source.name}:`, err.message);
        return [];
      }
    })
  );

  return results.flat();
}

async function processJobs(jobs, sendJobFn) {
  let newJobCount = 0;

  for (const job of jobs) {
    const cleaned = normalizeJob(job);

    if (isRelevantJob(cleaned.title)) {
      const isNew = await saveIfNew(cleaned);
      if (isNew) {
        await sendJobFn(cleaned);
        newJobCount++;
        // Small delay to avoid Telegram rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  return newJobCount;
}

module.exports = {
  fetchAllJobs,
  processJobs,
};
