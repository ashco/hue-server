require("dotenv").config();

const express = require("express");
const v3 = require("node-hue-api").v3;

const { genRandomHue } = require("./lib/helpers");

const app = express();

const LightState = v3.lightStates.LightState;

const USERNAME = process.env.USERNAME,
  // The name of the light we wish to retrieve by name
  LIGHT_ID = 11; // 8, 9, 11

v3.discovery
  // connect to bridge
  .nupnpSearch()
  .then((searchResults) => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then((api) => {
    // Using a LightState object to build the desired state
    const state = new LightState().on().ct(200).brightness(100);
    return api.lights.setLightState(LIGHT_ID, state);
  })
  .then((result) => {
    console.log(`Light state change was successful? ${result}`);
  });

app.get("/randomize", async (req, res, next) => {
  // console.log(`I'm so random! ${Math.random()}`);
  // try {
  // } catch {
  // }
  v3.discovery
    // connect to bridge
    .nupnpSearch()
    .then((searchResults) => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then((api) => {
      // Using a LightState object to build the desired state
      // const state = new LightState()
      //   .on()
      //   .brightness(100)
      //   .saturation(100)
      //   .hue(genRandomHue())
      //   .alertShort();
      // return api.lights.setLightState(LIGHT_ID, state);
      const sideState = new LightState()
        .on()
        .brightness(100)
        .saturation(100)
        .hue(genRandomHue())
        .alertShort();
      const centerState = new LightState()
        .on()
        .brightness(100)
        .saturation(100)
        .hue(genRandomHue())
        .alertShort();
      api.lights.setLightState(8, sideState);
      api.lights.setLightState(9, sideState);
      return api.lights.setLightState(11, centerState);
    })
    .then((result) => {
      console.log(`Light state change was successful? ${result}`);
    });

  res.status(200).send();
});

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Hue Randomizer Server running on port http://localhost:${port}`);
});
