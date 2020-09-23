const { getSensorId } = require("./getSensorId");
const { randomizeLights } = require("./randomizeLights");
const { verifyRecentRequest } = require("./verifyRecentRequest");
const { SENSOR_MAP } = require("./SENSOR_MAP");

async function pollSensors(config) {
  const updates = [];
  for (sensorId in config) {
    // get switch information
    const sensorData = await getSensorId(sensorId);
    const lightGroup = config[sensorId];

    // if switch was held down, randomize lightgroup
    if (
      sensorData.buttonevent === 1003 &&
      verifyRecentRequest(sensorData.lastupdated)
    ) {
      await randomizeLights(lightGroup);

      updates.push(SENSOR_MAP[sensorId]);
    }
  }

  return updates;
}

module.exports = { pollSensors };
