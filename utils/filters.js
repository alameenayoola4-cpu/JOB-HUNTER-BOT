// Developer job keywords - focused on specific roles
const keywords = [
  // Frontend Developer
  "frontend",
  "front end",
  "front-end",
  "frontend developer",
  "frontend engineer",
  "react developer",
  "react engineer",
  "vue developer",
  "angular developer",
  "ui developer",
  "ui engineer",

  // Backend Developer
  "backend",
  "back end",
  "back-end",
  "backend developer",
  "backend engineer",
  "node developer",
  "node.js developer",
  "python developer",
  "java developer",
  "api developer",
  "server developer",

  // Web Developer
  "web developer",
  "web engineer",
  "website developer",
  "web application",
  "web dev",

  // App Developer (Mobile)
  "app developer",
  "mobile developer",
  "mobile engineer",
  "ios developer",
  "android developer",
  "react native",
  "flutter developer",
  "mobile app",

  // Full Stack
  "fullstack",
  "full stack",
  "full-stack",
  "fullstack developer",
  "fullstack engineer",
  "mern developer",
  "mean developer",

  // Software Engineer
  "software engineer",
  "software developer",
  "swe",
  "engineer",
  "developer",
];

module.exports = {
  isRelevantJob(title) {
    if (!title) return false;
    const lowerTitle = title.toLowerCase();
    return keywords.some((k) => lowerTitle.includes(k.toLowerCase()));
  },
};
