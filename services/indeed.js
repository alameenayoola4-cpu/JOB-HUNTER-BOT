const axios = require("axios");

module.exports = async function () {
  // Adzuna API - free job search API (no auth for basic usage)
  // Using their public job search
  const url = "https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=&app_key=&results_per_page=20&what=developer&where=remote&content-type=application/json";

  try {
    // Fallback: Use JSearch API via RapidAPI alternative - Remotive API
    const remotiveUrl = "https://remotive.com/api/remote-jobs?limit=20";

    const res = await axios.get(remotiveUrl, {
      headers: {
        "User-Agent": "JobHunterBot/1.0",
      },
    });

    const jobs = res.data.jobs || [];

    return jobs.slice(0, 15).map((job) => ({
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || "Remote",
      url: job.url,
      source: "Remotive",
    }));
  } catch (err) {
    console.error("Remotive fetch error:", err.message);
    return [];
  }
};
