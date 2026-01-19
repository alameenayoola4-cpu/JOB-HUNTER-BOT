// Test script to verify all scrapers are working
require("dotenv").config();

const remoteok = require("../services/remoteok");
const remotive = require("../services/indeed");
const arbeitnow = require("../services/linkedin");
const wework = require("../services/weworkremotely");
const themuse = require("../services/gulftalent");
const himalayas = require("../services/twitter");
const startupjobs = require("../services/startupjobs");
const joboard = require("../services/joboard");
const hackernews = require("../services/hackernews");
const reddit = require("../services/reddit");
const { isRelevantJob } = require("../utils/filters");

async function testAllScrapers() {
    console.log("Testing all job scrapers...\n");
    console.log("Looking for: Frontend, Backend, Web Dev, App Dev, Full Stack, Software Engineer\n");

    const scrapers = [
        { name: "RemoteOK", fn: remoteok },
        { name: "Remotive", fn: remotive },
        { name: "Arbeitnow", fn: arbeitnow },
        { name: "WeWorkRemotely (RSS)", fn: wework },
        { name: "TheMuse", fn: themuse },
        { name: "Himalayas", fn: himalayas },
        { name: "StartupJobs", fn: startupjobs },
        { name: "JoBoard", fn: joboard },
        { name: "HackerNews (RSS)", fn: hackernews },
        { name: "Reddit", fn: reddit },
    ];

    let totalJobs = 0;
    let relevantJobs = 0;

    for (const scraper of scrapers) {
        console.log(`\nTesting ${scraper.name}...`);

        try {
            const jobs = await scraper.fn();

            // Filter for relevant jobs only
            const filtered = jobs.filter((job) => isRelevantJob(job.title));

            console.log(`   Fetched: ${jobs.length} jobs`);
            console.log(`   Relevant: ${filtered.length} jobs`);

            if (filtered.length > 0) {
                console.log(`   Sample: "${filtered[0].title}" at ${filtered[0].company}`);
            }

            totalJobs += jobs.length;
            relevantJobs += filtered.length;
        } catch (err) {
            console.log(`   Error: ${err.message}`);
        }
    }

    console.log(`\n========================================`);
    console.log(`Total fetched: ${totalJobs} jobs`);
    console.log(`Relevant jobs: ${relevantJobs} jobs`);
    console.log(`========================================\n`);
}

testAllScrapers();
