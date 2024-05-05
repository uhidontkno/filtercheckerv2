<img align="right" src="readme/preview.png" height="270px"></img>
# FilterChecker V2
The most powerful unblocked link checker, supporting these filters:
* Lightspeed Systems
* Palo Alto Systems
* FortiGuard

<br>

Also comes with **many** QoL (quality of life) features, including:
* Ability to be used as a User App for even better convenience
* Built-In API that can be enabled (pass `--web <port>`, default port is 10000)
* Check all filters, or just a single filter
* Made in TypeScript, not Python, so therefore type friendly
* Showing results ephemerally is now an option
* More detailed and user-friendly outputs

## Setup
Setting up FilterChecker V2 is as easy as pie! <br >
Assuming you already cloned the repo, and installed [Bun](https://bun.sh):
1. Install packages using `bun i`
2. Put your bot token in your `.env` file, use `example.env` as an example
3. Start the bot with `bun run start`, if you wish to run the API alongside, you can turn your command into `bun run start --web`, and if you want to specify a custom port, `bun run start --web 8080`