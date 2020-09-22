require("dotenv").config();

const express = require("express");
const v3 = require("node-hue-api").v3;
const bodyParser = require("body-parser");

const { genRandomHue } = require("./lib/helpers");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const LightState = v3.lightStates.LightState;

const PORT = process.env.PORT || 9000;
const USERNAME = process.env.USERNAME;

/**
 * optBag {
 *   username: req
 *   lights: [1, 3, 5],
 *   group: 1
 *   lightGroups: [[1, 2], [4]]
 * }
 * */

app.post("/randomize", async (req, res, next) => {
  try {
    const { username, type } = req.body;
    const data = JSON.parse(req.body.data);

    v3.discovery
      // connect to bridge
      .nupnpSearch()
      .then((searchResults) => {
        const host = searchResults[0].ipaddress;
        return v3.api.createLocal(host).connect(username);
      })
      .then((api) => {
        // Using a LightState object to build the desired state
        if (type === "LIGHTS") {
          data.forEach((light) => {
            const state = new LightState()
              .on()
              .brightness(100)
              .saturation(100)
              .hue(genRandomHue());

            api.lights.setLightState(parseInt(light), state);
          });
        } else if (type === "LIGHT_GROUPS") {
        }
      });

    // if (lights) {
    //   lights.split(",").forEach((light) => {
    //     const state = new LightState()
    //       .on()
    //       .brightness(100)
    //       .saturation(100)
    //       .hue(genRandomHue());

    //     api.lights.setLightState(parseInt(light), state);
    //   });
    // } else if (group) {
    //   console.log(group);
    // } else if (lightGroups) {
    //   console.log(lightGroups);
    // }

    // const sideState = new LightState()
    //   .on()
    //   .brightness(100)
    //   .saturation(100)
    //   .hue(genRandomHue())
    //   .alertShort();
    // const centerState = new LightState()
    //   .on()
    //   .brightness(100)
    //   .saturation(100)
    //   .hue(genRandomHue())
    //   .alertShort();
    // api.lights.setLightState(8, sideState);
    // api.lights.setLightState(9, sideState);
    // return api.lights.setLightState(11, centerState);
    // });

    res.status(200).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Hue Randomizer Server running on port http://localhost:${PORT}`);
});
