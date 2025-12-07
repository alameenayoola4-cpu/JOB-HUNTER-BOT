const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function () {
  const keywords = "frontend developer";
  const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(
    keywords
  )}&l=&fromage=1`;

  const jobs = [];

  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    $(".result").each((_, el) => {
      const title = $(el).find("h2").text().trim();
      const company = $(el).find(".companyName").text().trim();
      const jobUrl = "https://indeed.com" + $(el).find("a").attr("href");

      jobs.push({ title, company, url: jobUrl, source: "Indeed" });
    });

    return jobs;
  } catch (err) {
    return [];
  }
};
