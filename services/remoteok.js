const axios = require("axios");

module.exports = async function () {
  try {
    const res = await axios.get("https://remoteok.com/api", {
      headers: {
        "User-Agent": "JobHunterBot/1.0",
      },
    });

    return res.data
      .filter((j) => j.position)
      .slice(0, 20) // Limit to 20 jobs per scan
      .map((job) => ({
        title: job.position,
        company: job.company,
        location: job.location || "Remote",
        url: job.url,
        source: "RemoteOK",
      }));
  } catch (err) {
    console.error("RemoteOK fetch error:", err.message);
    return [];
  }
};
