// @ts-check is better
const { config } = require('seyfert');

module.exports = config.bot({
   token: process.env.BOT_TOKEN ?? "",
   intents: ["Guilds"],
   locations: {
       base: "src",
       output: "src", //If you are using bun, set "src" instead
       commands: "commands",
       events: "events"
   }
});