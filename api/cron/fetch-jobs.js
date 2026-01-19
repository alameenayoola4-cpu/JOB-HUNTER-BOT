const { fetchAllJobs, processJobs } = require("../../services/jobFetcher");
const { sendJob, sendMessage } = require("../../services/telegram");

export default async function handler(req, res) {
    // Verify the request is from Vercel Cron (optional security)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log("Request without CRON_SECRET - proceeding anyway");
    }

    console.log("Daily job scan started at:", new Date().toISOString());

    try {
        // Fetch jobs from all platforms
        const jobs = await fetchAllJobs();
        console.log(`Total jobs fetched: ${jobs.length}`);

        // Process and send new jobs
        const newJobCount = await processJobs(jobs, sendJob);

        // Send summary message
        if (newJobCount > 0) {
            await sendMessage(
                process.env.CHAT_ID,
                `*Daily Scan Complete!*\n\nFound ${newJobCount} new relevant jobs today.`,
                { parse_mode: "Markdown" }
            );
        }

        console.log(`Scan complete. ${newJobCount} new jobs sent.`);

        return res.status(200).json({
            success: true,
            totalFetched: jobs.length,
            newJobsSent: newJobCount,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Cron job error:", error);

        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
