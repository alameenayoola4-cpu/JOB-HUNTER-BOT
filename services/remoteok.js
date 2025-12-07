const axios = require("axios");

module.exports = async function () {
  try {
    const res = await axios.get("https://remoteok.com/api");

    return res.data
      .filter((j) => j.position)
      .map((job) => ({
        title: job.position,
        company: job.company,
        url: job.url,
        source: "RemoteOK",
      }));
  } catch {
    return [];
  }
};
