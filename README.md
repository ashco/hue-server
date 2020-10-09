# Hue Server
This project is a Node/Express server that allows you to randomize the Philips Hue lights on your network. You can randomize via an API post request or by continuously polling for a specific status on a physical remote.

The creation and workings of this project has been documented through video. Check it out here:

https://youtu.be/mUMHbUPdDyo

## Technologies
- Node v12.18.4
- Express
- [node-hue-api](https://github.com/peter-murray/node-hue-api)
- [node-cron](https://www.npmjs.com/package/node-cron)

## Configuration
The `.env` and `/lib/config.js` files will need to be configured to work with your environment.

- `.env`
  - **USER_ID**: Required code used as authentication key when sending commands to Philips Hue Hub. A quick guide on how to generate this key can be found [here](https://developers.meethue.com/develop/get-started-2/).
  - **PORT**: Optional env variable. Defaults to 9000.
  - **POLL_TIME**: Optional env variable: Lets you specify polling period for sensor status. You can see how to format this string [here](https://www.npmjs.com/package/node-cron). Defaults to run every 5 seconds.

- `lib/config.js` - Contains array of objects that contain room data. Data objects include the following:
  - name: Name of room.
  - switchId: ID of sensor you are checking against for user input. I am checking Hue Dimmer Switches for long presses on their ON button (code 1003), but this can easily be adjusted. Helpful link [here](https://developers.meethue.com/develop/application-design-guidance/hue-dimmer-switch-programming/).
  - lights: Array of light ID's to randomize. Lights located in sub arrays of the array will all have the same random LightState applied.

## How to Run
1. Download this repo and install packages via `yarn install`.
2. Make sure configuration has been updated for your specific environment.
3. Start server via `yarn start`

The server will automatically start running cron jobs that check specified signals (ex: a Philips Hue light switch) for specific commands. If there is a match, then assigned list of lights will randomize.

## API Example
Example API Post requests to randomize specific lights can be found here. Note that data array contains light ID's and lights in sub arrays will receive the same random state.

https://documenter.getpostman.com/view/3450139/TVKEXxSH
