const { pollSensors } = require("./pollSensors");

const cron = require("node-cron");

// http://corntab.com/
cron.schedule(process.env.CRON, async () => {
  console.log(`[${new Date().toISOString()}]: Checking sensors`);

  const config = {
    8: [5, 6],
    10: [[1, 3], 2, 4, 7, 10],
  };

  const updates = await pollSensors(config);
  if (updates.length) {
    console.log(`${updates} randomized`);
  }
});
