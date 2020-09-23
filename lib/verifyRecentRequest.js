const add = require("date-fns/add");
const differenceInSeconds = require("date-fns/differenceInSeconds");

// lastupdated = 2020-09-23T19:44:04
function verifyRecentRequest(lastupdated) {
  const last = Date.parse(lastupdated); // thinks now is 7 hours ahead
  const now = add(new Date(), {
    hours: 7,
  });

  return differenceInSeconds(now, last) <= 10;
}

module.exports = { verifyRecentRequest };
