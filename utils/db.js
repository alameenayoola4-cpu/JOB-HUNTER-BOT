const { kv } = require("@vercel/kv");

const SEEN_JOBS_KEY = "seen_job_urls";

module.exports = {
  async saveIfNew(job) {
    try {
      // Check if we've seen this job URL before
      const isMember = await kv.sismember(SEEN_JOBS_KEY, job.url);

      if (isMember) {
        return false; // Already seen
      }

      // Add to seen jobs set
      await kv.sadd(SEEN_JOBS_KEY, job.url);

      // Keep the set from growing too large (max 10000 entries)
      const size = await kv.scard(SEEN_JOBS_KEY);
      if (size > 10000) {
        // Remove oldest entries (this is approximate since sets are unordered)
        const members = await kv.smembers(SEEN_JOBS_KEY);
        const toRemove = members.slice(0, 1000);
        if (toRemove.length > 0) {
          await kv.srem(SEEN_JOBS_KEY, ...toRemove);
        }
      }

      return true; // New job
    } catch (err) {
      console.error("Database error:", err.message);
      // If DB fails, treat as new job to avoid missing notifications
      return true;
    }
  },
};
