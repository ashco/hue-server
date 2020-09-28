const { pollSensors } = require("./helpers");
const { config } = require("./config");

const cron = require("node-cron");

// http://corntab.com/
cron.schedule(`*/${process.env.POLL_TIME} * * * * *`, async () => {
  const updateList = await pollSensors(config);
  if (updateList.length) {
    console.log(`[${new Date().toISOString()}]: ${updateList} randomized`);
  }
});
