function genRandomHue() {
  return Math.floor(Math.random() * 65535);
}

function genRandomSat() {
  return 75 + Math.floor(Math.random() * 25);
}

// function randomizeLight()

module.exports = { genRandomHue, genRandomSat };
