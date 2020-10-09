const v3 = require("node-hue-api").v3;
const differenceInSeconds = require("date-fns/differenceInSeconds");

const { LightState } = v3.lightStates;

// ===== HUE API =====
async function getHueApi() {
  // connect to bridge
  const searchResults = await v3.discovery.nupnpSearch();
  const host = searchResults[0].ipaddress;

  return v3.api.createLocal(host).connect(process.env.USER_ID);
}

async function randomizeLights(data) {
  const api = await getHueApi();
  // Using a LightState object to build the desired state
  data.forEach((lightGroup) => {
    const state = new LightState()
      .on()
      .brightness(100)
      .saturation(genRandomSat())
      .hue(genRandomHue());

    if (typeof lightGroup === "number") lightGroup = [lightGroup];

    lightGroup.forEach((light) => {
      api.lights.setLightState(parseInt(light), state);
    });
  });
}

async function getSensorId(sensorId) {
  const api = await getHueApi();
  const { lastupdated, buttonevent } = await api.sensors.getSensor(sensorId);

  return {
    sensorId,
    lastupdated,
    buttonevent,
  };
}

async function pollSensors(config) {
  const updateList = [];
  for (room of config) {
    // get switch information
    const sensorData = await getSensorId(room.switchId);

    // if switch was held down, randomize lightgroup
    if (
      sensorData.buttonevent === 1003 &&
      getSecFromNow(sensorData.lastupdated) <= parseInt(process.env.POLL_TIME)
    ) {
      await randomizeLights(room.lights);

      updateList.push(room.name);
    }
  }

  return updateList;
}

// ===== ADDITIONAL FUNCTIONS =====
function genRandomHue() {
  return Math.floor(Math.random() * 65535);
}

function genRandomSat() {
  const range = 50;

  return 100 - range + Math.floor(Math.random() * range);
}

// lastupdated = 2020-09-23T19:44:04
function getSecFromNow(lastupdated) {
  const last = Date.parse(lastupdated);

  return differenceInSeconds(new Date(), last);
}

module.exports = { randomizeLights, pollSensors };
