const v3 = require("node-hue-api").v3;

async function getHueApi() {
  // connect to bridge
  const searchResults = await v3.discovery.nupnpSearch();
  const host = searchResults[0].ipaddress;

  return v3.api.createLocal(host).connect(process.env.USERNAME);
}

module.exports = { getHueApi };
