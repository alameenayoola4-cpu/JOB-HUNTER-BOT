const axios = require("axios");

module.exports = async function () {
  // TheMuse API - free, no auth required
  const url = "https://www.themuse.com/api/public/jobs?page=1&descending=true&category=Engineering&category=Data%20and%20Analytics&level=Senior%20Level&level=Mid%20Level";

  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "JobHunterBot/1.0",
        "Accept": "application/json",
      },
      timeout: 15000,
    });

    const jobs = res.data.results || [];

    return jobs.slice(0, 15).map((job) => ({
      title: job.name || "Unknown Title",
      company: job.company?.name || "Unknown Company",
      location: job.locations?.[0]?.name || "Flexible / Remote",
      url: job.refs?.landing_page || `https://www.themuse.com/jobs/${job.id}`,
      source: "TheMuse",
    }));
  } catch (err) {
    console.error("TheMuse fetch error:", err.message);
    return [];
  }
};
