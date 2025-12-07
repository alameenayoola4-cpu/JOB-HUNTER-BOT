const keywords = [
  "frontend",
  "front end",
  "fullstack",
  "full stack",
  "web developer",
  "react",
  "javascript",
  "next.js",
  "software engineer",
];

module.exports = {
  isRelevantJob(title) {
    title = title.toLowerCase();
    return keywords.some((k) => title.includes(k));
  },
};
