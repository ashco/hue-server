require("dotenv").config();

const express = require("express");
const fetch = require("node-fetch");
const v3 = require("node-hue-api").v3;
const bodyParser = require("body-parser");

const { genRandomHue, genRandomSat } = require("./lib/helpers");
const { getHueApi } = require("./lib/getHueApi");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const PORT = process.env.PORT || 9000;
const LightState = v3.lightStates.LightState;

app.post("/randomize", async (req, res, next) => {
  try {
    const { data } = req.body;

    const api = await getHueApi();
    // Using a LightState object to build the desired state
    JSON.parse(data).forEach((lightGroup) => {
      const state = new LightState()
        .on()
        .brightness(100)
        // .saturation(100)
        .saturation(genRandomSat())
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

app.get("/allSensors", async (req, res, next) => {
  try {
    const api = await getHueApi();

    api.sensors.getAll().then((allSensors) => {
      // Display the details of the sensors we got back
      // console.log(JSON.stringify(allSensors, null, 2));
      res.status(200).send(allSensors);
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/sensor/:sensorId", async (req, res, next) => {
  try {
    const { sensorId } = req.params;

    const api = await getHueApi();
    const { lastupdated, buttonevent } = await api.sensors.getSensor(sensorId);

    const dataObj = {
      sensorId,
      lastupdated,
      buttonevent,
    };

    res.status(200).send(JSON.stringify(dataObj));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/allRules", async (req, res, next) => {
  try {
    const api = await getHueApi();

    api.rules.getAll().then((allRules) => {
      // Display the details of the sensors we got back
      res.status(200).send(allRules);
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

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

app.get("/poll", async (req, res, next) => {
  // get switch information
  const response = await fetch(`http://localhost:${PORT}/sensor/10`);
  const json = await response.json();
  console.log(json);
  // res.status(200).send(json);
  // check if switch has button event 1003
  if (json.buttonevent === 1003) {
    console.log("Randomizing Living Room");
    // const res2 = await fetch(`http://localhost:${PORT}/randomize`, {
    //   method: "POST",
    //   body: [[1, 3], 2, 4, 7, 10],
    // });
    // console.log(res2);
    const api = await getHueApi();
    // Using a LightState object to build the desired state
    [[1, 3], 2, 4, 7, 10].forEach((lightGroup) => {
      const state = new LightState()
        .on()
        .brightness(100)
        // .saturation(100)
        .saturation(genRandomSat())
        .hue(genRandomHue());

      if (typeof lightGroup === "number") lightGroup = [lightGroup];

      lightGroup.forEach((light) => {
        api.lights.setLightState(parseInt(light), state);
      });
    });
    res.status(200).send(`Lights have been randomized`);
  }

  // + modified in last 30 seconds
  // if so, send randomize request.
  // update switch state so repeat randomizes do not occur
});

app.listen(PORT, () => {
  console.log(`Hue Randomizer Server running on port http://localhost:${PORT}`);
});
