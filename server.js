require("dotenv").config();

const express = require("express");

const v3 = require("node-hue-api").v3;
const bodyParser = require("body-parser");

const { getHueApi } = require("./lib/getHueApi");
const { randomizeLights } = require("./lib/randomizeLights");
const { getSensorId } = require("./lib/getSensorId");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const PORT = process.env.PORT || 9000;
const LightState = v3.lightStates.LightState;

const SENSOR_MAP = {
  10: "LIVING ROOM",
  // ??: 'BEDROOM'
};

app.post("/randomize", async (req, res, next) => {
  try {
    const { data } = req.body;

    await randomizeLights(JSON.parse(data));

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

// app.get("/sensor/:sensorId", async (req, res, next) => {
//   try {
//     const { sensorId } = req.params;

//     const api = await getHueApi();
//     const { lastupdated, buttonevent } = await api.sensors.getSensor(sensorId);

//     const dataObj = {
//       sensorId,
//       lastupdated,
//       buttonevent,
//     };

//     res.status(200).send(JSON.stringify(dataObj));
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// app.get("/allRules", async (req, res, next) => {
//   try {
//     const api = await getHueApi();

//     api.rules.getAll().then((allRules) => {
//       // Display the details of the sensors we got back
//       res.status(200).send(allRules);
//     });
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// {??: [5, 6], 10: [[1, 3], 2, 4, 7, 10]}
app.post("/poll", async (req, res, next) => {
  const data = JSON.parse(req.body.data);

  const updates = [];
  for (sensorId in data) {
    // get switch information
    const sensorData = await getSensorId(sensorId);
    const lightGroup = data[sensorId];

    // if switch was held down, randomize lightgroup
    if (sensorData.buttonevent === 1003) {
      await randomizeLights(lightGroup);

      updates.push(SENSOR_MAP[sensorId]);
    }
  }

  if (updates.length) {
    res.status(200).send(`${updates} randomized`);
  } else {
    res.status(200).send("No updates");
  }

  // + modified in last 30 seconds
  // if so, send randomize request.
  // update switch state so repeat randomizes do not occur
});

app.listen(PORT, () => {
  console.log(`Hue Server running at http://localhost:${PORT}`);
});
