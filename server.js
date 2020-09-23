require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");

const { randomizeLights } = require("./lib/helpers");

// enable cron job
require("./lib/cron");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const PORT = process.env.PORT || 9000;

app.post("/randomize", async (req, res, next) => {
  try {
    const { data } = req.body;

    await randomizeLights(JSON.parse(data));

    res.status(200).send(`Lights have been randomized: ${data}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Hue Server running at http://localhost:${PORT}`);
});
