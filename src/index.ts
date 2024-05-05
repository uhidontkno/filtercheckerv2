import { Client } from 'seyfert';

const client = new Client();

if (process.argv.includes("--web")) {
    require("./web/api.ts")
}
if (!process.argv.includes("--no-bot")) {
client.start().then(() => client.uploadCommands());
} else {
    setInterval(()=>{},100)
}
