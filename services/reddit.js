const axios = require("axios");

module.exports = async function () {
    // Reddit job subreddits - using JSON API (no auth required for public subreddits)
    const subreddits = [
        "forhire", // Freelance and job posts
        "remotejs", // Remote JavaScript jobs
        "remotejobs", // Remote work opportunities
        "jobbit", // Tech jobs
        "hiring", // Direct hiring posts
    ];

    const allJobs = [];

    for (const subreddit of subreddits) {
        try {
            const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=10`;

            const res = await axios.get(url, {
                headers: {
                    "User-Agent": "JobHunterBot/1.0 (job aggregator)",
                },
                timeout: 10000,
            });

            const posts = res.data?.data?.children || [];

            // Filter for hiring posts
            const hiringPosts = posts
                .filter((post) => {
                    const title = (post.data.title || "").toLowerCase();
                    const flair = (post.data.link_flair_text || "").toLowerCase();

                    // Look for hiring-related posts
                    return (
                        title.includes("hiring") ||
                        title.includes("[hiring]") ||
                        flair.includes("hiring") ||
                        title.includes("looking for") ||
                        title.includes("job") ||
                        title.includes("developer") ||
                        title.includes("engineer")
                    );
                })
                .map((post) => ({
                    title: truncate(post.data.title, 100),
                    company: `r/${subreddit}`,
                    location: "Remote",
                    url: `https://reddit.com${post.data.permalink}`,
                    source: "Reddit",
                }));

            allJobs.push(...hiringPosts);
        } catch (err) {
            console.error(`Reddit r/${subreddit} error:`, err.message);
        }
    }

    // Remove duplicates and limit
    const uniqueJobs = allJobs.filter(
        (job, index, self) => index === self.findIndex((j) => j.url === job.url)
    );

    return uniqueJobs.slice(0, 20);
};

function truncate(str, len) {
    if (!str) return "";
    // Clean up Reddit title formatting
    str = str.replace(/\[hiring\]/gi, "").replace(/\[for hire\]/gi, "").trim();
    return str.length > len ? str.slice(0, len) + "..." : str;
}
