const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function () {
  const q = "frontend developer hiring remote";
  const url = `https://nitter.net/search?f=tweets&q=${encodeURIComponent(q)}`;

  const jobs = [];

  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    $(".tweet-content").each((_, el) => {
      const text = $(el).text().trim();
      const link = "https://x.com" + $(el).find("a").attr("href");

      jobs.push({
        title: text.slice(0, 50) + "...",
        company: "X (Twitter)",
        url: link,
        source: "Twitter",
      });
    });

    return jobs;
  } catch {
    return [];
  }
};
