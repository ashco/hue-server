function genRandomHue() {
  return Math.floor(Math.random() * 65535);
}

module.exports = {
  genRandomHue,
};
