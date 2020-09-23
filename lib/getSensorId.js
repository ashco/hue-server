const { getHueApi } = require("./getHueApi");

// async function getSensorIds(sensorIds) {
//   const dataObj = {};

//   for (sensorId of sensorIds) {
//     dataObj[sensorId] = await getSensorId(sensorId);
//   }

//   return dataObj;
// }

async function getSensorId(sensorId) {
  const api = await getHueApi();
  const { lastupdated, buttonevent } = await api.sensors.getSensor(sensorId);

  return {
    sensorId,
    lastupdated,
    buttonevent,
  };
}

module.exports = { getSensorId };
