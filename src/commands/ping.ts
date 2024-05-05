import { Declare, Command, type CommandContext } from 'seyfert';

@Declare({
  name: 'ping',
  description: 'Show the ping with discord',
  contexts: ['BOT_DM', 'GUILD', 'PRIVATE_CHANNEL'],
  integrationTypes: ['GUILD_INSTALL', 'USER_INSTALL']
})
export default class PingCommand extends Command {

  async run(ctx: CommandContext) {
    // @ts-expect-error average latency between shards
    const ping = ctx.client.gateway.latency;

    await ctx.write({
      content: `Pong! Ping: \`${ping}ms\``
    });
  }
}