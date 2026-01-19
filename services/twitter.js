const axios = require("axios");

module.exports = async function () {
  // Himalayas.app API - free remote job API
  const url = "https://himalayas.app/jobs/api?limit=20";

  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "JobHunterBot/1.0",
      },
    });

    const jobs = res.data.jobs || [];

    return jobs.slice(0, 15).map((job) => ({
      title: job.title,
      company: job.companyName,
      location: job.locationRestrictions?.[0] || "Worldwide",
      url: `https://himalayas.app/jobs/${job.slug}`,
      source: "Himalayas",
    }));
  } catch (err) {
    console.error("Himalayas fetch error:", err.message);
    return [];
  }
};
