const Parser = require("rss-parser");
const parser = new Parser();

module.exports = async function () {
  // WeWorkRemotely RSS feed - reliable and always up-to-date
  const url = "https://weworkremotely.com/remote-jobs.rss";

  try {
    const feed = await parser.parseURL(url);

    return feed.items.slice(0, 15).map((item) => ({
      title: item.title || "Unknown Title",
      company: item.company || extractCompany(item.title),
      location: "Remote",
      url: item.link,
      source: "WeWorkRemotely",
    }));
  } catch (err) {
    console.error("WeWorkRemotely fetch error:", err.message);
    return [];
  }
};

// WWR titles often include company name
function extractCompany(title) {
  if (!title) return "Unknown Company";
  const match = title.match(/^(.+?):/);
  return match ? match[1].trim() : "Unknown Company";
}
