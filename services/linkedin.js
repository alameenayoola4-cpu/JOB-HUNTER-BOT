const axios = require("axios");

module.exports = async function () {
  // Arbeitnow API - free, no auth required, has quality remote jobs
  const url = "https://www.arbeitnow.com/api/job-board-api";

  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "JobHunterBot/1.0",
      },
    });

    const jobs = res.data.data || [];

    return jobs
      .filter((job) => job.remote === true)
      .slice(0, 15)
      .map((job) => ({
        title: job.title,
        company: job.company_name,
        location: job.location || "Remote",
        url: job.url,
        source: "Arbeitnow",
      }));
  } catch (err) {
    console.error("Arbeitnow fetch error:", err.message);
    return [];
  }
};
