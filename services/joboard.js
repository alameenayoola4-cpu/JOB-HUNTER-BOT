const axios = require("axios");

module.exports = async function () {
    // JoBoard API - aggregates developer jobs
    const url = "https://joboard.io/api/jobs?q=developer&remote=true";

    try {
        const res = await axios.get(url, {
            headers: {
                "User-Agent": "JobHunterBot/1.0",
            },
            timeout: 15000,
        });

        const jobs = res.data.jobs || res.data || [];

        return (Array.isArray(jobs) ? jobs : []).slice(0, 15).map((job) => ({
            title: job.title || "Unknown Title",
            company: job.company || job.company_name || "Unknown Company",
            location: job.location || "Remote",
            url: job.url || job.apply_url,
            source: "JoBoard",
        }));
    } catch (err) {
        console.error("JoBoard fetch error:", err.message);

        // Fallback: Try 4DayWeek jobs (remote-focused)
        try {
            const fallbackUrl = "https://4dayweek.io/api/jobs";
            const fallbackRes = await axios.get(fallbackUrl, {
                headers: { "User-Agent": "JobHunterBot/1.0" },
                timeout: 10000,
            });

            const fallbackJobs = fallbackRes.data.jobs || fallbackRes.data || [];
            return (Array.isArray(fallbackJobs) ? fallbackJobs : []).slice(0, 10).map((job) => ({
                title: job.title || "Unknown Title",
                company: job.company || "Unknown Company",
                location: job.location || "Remote",
                url: job.url,
                source: "4DayWeek",
            }));
        } catch {
            return [];
        }
    }
};
