const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function () {
  const url = "https://weworkremotely.com/remote-jobs/search?term=developer";

  const jobs = [];

  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    $("li > a").each((_, el) => {
      const title = $(el).find(".title").text().trim();
      if (!title) return;

      jobs.push({
        title,
        company: $(el).find(".company").text().trim(),
        url: "https://weworkremotely.com" + $(el).attr("href"),
        source: "WeWorkRemotely",
      });
    });

    return jobs;
  } catch {
    return [];
  }
};
