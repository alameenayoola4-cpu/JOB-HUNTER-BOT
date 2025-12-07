const Parser = require("rss-parser");
const parser = new Parser();

module.exports = async function () {
  const url =
    "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=frontend+developer";

  try {
    const feed = await parser.parseURL(url);
    return feed.items.map((i) => ({
      title: i.title,
      company: i.creator,
      url: i.link,
      source: "LinkedIn",
    }));
  } catch {
    return [];
  }
};
