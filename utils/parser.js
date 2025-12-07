module.exports = {
  cleanText(text) {
    if (!text) return "";
    return text.replace(/\s+/g, " ").trim();
  },

  normalizeJob(job) {
    return {
      title: job.title ? job.title.trim() : "Unknown Title",
      company: job.company ? job.company.trim() : "Unknown Company",
      location: job.location || "Worldwide",
      url: job.url || "",
      source: job.source || "Unknown",
    };
  },
};
