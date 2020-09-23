const { pollSensors } = require("./helpers");
const { switchToLightsMap } = require("./config");

const cron = require("node-cron");

// http://corntab.com/
cron.schedule(process.env.CRON || "*/10 * * * * *", async () => {
  const updates = await pollSensors(switchToLightsMap);
  if (updates.length) {
    console.log(`[${new Date().toISOString()}]: ${updates} randomized`);
  }
});
