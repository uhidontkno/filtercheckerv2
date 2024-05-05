import { Client } from 'seyfert';

const client = new Client();

if (process.argv[2] == "--web") {
    require("./web/api.ts")
}

client.start().then(() => client.uploadCommands());
