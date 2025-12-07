const fs = require("fs");
const path = "./database/jobs.json";


function loadDB() {
  try {
    if (!fs.existsSync(path)) return [];
    return JSON.parse(fs.readFileSync(path));
  } catch (err) {
    console.error("Error loading jobs database:", err);
    return [];
  }
}


function saveDB(data) {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving jobs database:", err);
  }
}

module.exports = {
  saveIfNew(job) {
    const db = loadDB();
    const exists = db.some((j) => j.url === job.url);

    if (exists) return false;

    db.push(job);
    saveDB(db);
    return true;
  },
};
