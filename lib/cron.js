const { getSensorId, getSecFromNow, randomizeLights } = require("./helpers");
const { config } = require("../config");

const cron = require("node-cron");

async function pollSensors(config) {
  const updateList = [];
  for (room of config) {
    // get switch information
    const sensorData = await getSensorId(room.switchId);

    // if switch was held down, randomize lightgroup
    if (
      sensorData.buttonevent === 1003 &&
      // TODO: fix 28800 because for some reason this is coming up as utc time.
      getSecFromNow(sensorData.lastupdated) + 28800 <=
        parseInt(process.env.POLL_TIME)
    ) {
      await randomizeLights(room.lights);

      updateList.push(room.name);
    }
  }

  return updateList;
}

// http://corntab.com/
cron.schedule(`*/${process.env.POLL_TIME} * * * * *`, async () => {
  const updateList = await pollSensors(config);

  if (updateList.length) {
    console.log(`[${new Date().toISOString()}]: ${updateList} randomized`);
  }
});
