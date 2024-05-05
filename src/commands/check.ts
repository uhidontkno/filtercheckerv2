import { Declare, Command, type CommandContext, Options,
    createStringOption} from 'seyfert';

@Declare({
  name: 'check',
  description: 'Check a link against various filters'
})
@Options(
    {
        url: createStringOption({
          description: "The URL to check",
        }),
        filter: createStringOption({
            description: "The filter to check through",
            choices: [
                { name: 'All', value: 'all' },
                { name: 'FortiGuard', value: 'fortiguard' },
                { name: 'Palo Alto Systems', value: 'palo' },
                { name: 'Lightspeed', value: 'lightspeed' }
              ]
          }),
      }
)
export default class FilterCheckCommand extends Command {

  async run(ctx: CommandContext) {
    // @ts-expect-error average latency between shards
    const ping = ctx.client.gateway.latency;

    await ctx.write({
      content: `Pong! Ping: \`${ping}ms\``
    });
  }
}