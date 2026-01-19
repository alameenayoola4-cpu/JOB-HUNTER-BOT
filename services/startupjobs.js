const axios = require("axios");

module.exports = async function () {
    // Wellfound (AngelList) Jobs - startup job board
    const url = "https://www.workingnomads.com/api/exposed_jobs/";

    try {
        const res = await axios.get(url, {
            headers: {
                "User-Agent": "JobHunterBot/1.0",
                "Accept": "application/json",
            },
            timeout: 15000,
        });

        const jobs = Array.isArray(res.data) ? res.data : [];

        return jobs
            .filter((job) => {
                // Filter for dev jobs
                const title = (job.title || "").toLowerCase();
                return (
                    title.includes("developer") ||
                    title.includes("engineer") ||
                    title.includes("programmer") ||
                    title.includes("frontend") ||
                    title.includes("backend") ||
                    title.includes("fullstack")
                );
            })
            .slice(0, 15)
            .map((job) => ({
                title: job.title || "Unknown Title",
                company: job.company_name || "Unknown Company",
                location: job.location || "Remote",
                url: job.url,
                source: "WorkingNomads",
            }));
    } catch (err) {
        console.error("WorkingNomads fetch error:", err.message);
        return [];
    }
};
