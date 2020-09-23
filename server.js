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
        data.forEach((lightGroup) => {
          const state = new LightState()
            .on()
            .brightness(100)
            .saturation(100)
            .hue(genRandomHue());

          if (typeof lightGroup === "number") lightGroup = [lightGroup];

          lightGroup.forEach((light) => {
            console.log(lightGroup, light);
            api.lights.setLightState(parseInt(light), state);
          });
        });
      });

    res.status(200).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Hue Randomizer Server running on port http://localhost:${PORT}`);
});
