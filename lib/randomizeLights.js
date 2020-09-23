const v3 = require("node-hue-api").v3;

const { getHueApi } = require("./getHueApi");
const { genRandomHue, genRandomSat } = require("./helpers");

const LightState = v3.lightStates.LightState;

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

module.exports = { randomizeLights };
