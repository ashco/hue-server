require("dotenv").config();

const express = require("express");
const v3 = require("node-hue-api").v3;
const bodyParser = require("body-parser");

const { genRandomHue } = require("./lib/helpers");
const { getHueApi } = require("./lib/getHueApi");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const LightState = v3.lightStates.LightState;

app.post("/randomize", async (req, res, next) => {
  try {
    const { username, data } = req.body;

    const api = await getHueApi(username);
    // Using a LightState object to build the desired state
    JSON.parse(data).forEach((lightGroup) => {
      const state = new LightState()
        .on()
        .brightness(100)
        .saturation(100)
        .hue(genRandomHue());

      if (typeof lightGroup === "number") lightGroup = [lightGroup];

      lightGroup.forEach((light) => {
        api.lights.setLightState(parseInt(light), state);
      });
    });
    res.status(200).send(`Lights have been randomized: ${data}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/allSensors", async (req, res, next) => {});

// app.get("/allScenes", async (req, res, next) => {
//   try {
//     const { username } = req.body;

//     v3.discovery
//       .nupnpSearch()
//       .then((searchResults) => {
//         const host = searchResults[0].ipaddress;
//         return v3.api.createLocal(host).connect(username);
//       })
//       .then((api) => {
//         return api.scenes.getAll();
//       })
//       .then((scenes) => {
//         // Display all the scenes
//         scenes.forEach((scene) => {
//           console.log(scene.toStringDetailed());
//         });
//       })
//       .catch((err) => {
//         console.error(`Unexpected Error: ${err.message}`);
//       });
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// app.post("/createScene", async (req, res, next) => {
//   try {
//     // determine light group

//     // if group already has state arrangement, stop
//     // save new light state

//     const { username, data } = req.body;

//     v3.discovery
//       // connect to bridge
//       .nupnpSearch()
//       .then((searchResults) => {
//         const host = searchResults[0].ipaddress;
//         return v3.api.createLocal(host).connect(username);
//       })
//       .then((api) => {
//         const scene = v3.model.createLightScene();

//         scene.name = "Test Scene";
//         scene.lights = [8, 9, 11];

//         api.scenes.createScene(scene).then((scene) => {
//           console.log(
//             `Successfully created scene\n${scene.toStringDetailed()}`
//           );
//         });
//       });
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// app.post("/deleteScene", async (req, res, next) => {
//   try {
//     // determine light group

//     // if group already has state arrangement, stop
//     // save new light state

//     const { username, data } = req.body;

//     v3.discovery
//       // connect to bridge
//       .nupnpSearch()
//       .then((searchResults) => {
//         const host = searchResults[0].ipaddress;
//         return v3.api.createLocal(host).connect(username);
//       })
//       .then((api) => {
//         api.scenes.deleteScene(data).then((result) => {
//           console.log(`Deleted scene? ${result}`);
//         });
//       });
//     res.status(200).send("Scene Deleted");
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Hue Randomizer Server running on port http://localhost:${PORT}`);
});
