const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function () {
  const url = "https://www.gulftalent.com/mobile/jobs?search=developer";

  const jobs = [];

  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    $(".job-title").each((_, el) => {
      jobs.push({
        title: $(el).text().trim(),
        company: $(el).next(".company").text().trim(),
        url: "https://www.gulftalent.com" + $(el).parent().attr("href"),
        source: "GulfTalent",
      });
    });

    return jobs;
  } catch {
    return [];
  }
};
