const Parser = require("rss-parser");
const parser = new Parser();

module.exports = async function () {
    // Hacker News: Who is Hiring - monthly thread jobs via hnhiring.com RSS
    const url = "https://hnrss.org/newest?q=hiring+remote";

    try {
        const feed = await parser.parseURL(url);

        // Filter for actual job posts
        const jobPosts = feed.items
            .filter((item) => {
                const title = (item.title || "").toLowerCase();
                return (
                    title.includes("hiring") ||
                    title.includes("remote") ||
                    title.includes("developer") ||
                    title.includes("engineer")
                );
            })
            .slice(0, 15);

        return jobPosts.map((item) => ({
            title: truncate(item.title, 80) || "HN Job Post",
            company: "Hacker News",
            location: "Remote",
            url: item.link,
            source: "HackerNews",
        }));
    } catch (err) {
        console.error("HackerNews fetch error:", err.message);
        return [];
    }
};

function truncate(str, len) {
    if (!str) return "";
    return str.length > len ? str.slice(0, len) + "..." : str;
}
