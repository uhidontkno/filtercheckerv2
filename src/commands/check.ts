import { Declare, Command, type CommandContext, Options,
    createStringOption, Embed,
    createBooleanOption} from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types';
import filters from "../modules/filters"
@Options(
        {
            url: createStringOption({
                required:true,
              description: "The URL to check",
            }),
            filter: createStringOption({
                required:false,
                
                description: "The filter to check through",
                choices: [
                    { name: 'All', value: 'all' },
                    { name: 'FortiGuard', value: 'fortiguard' },
                    { name: 'Palo Alto Systems', value: 'palo' },
                    { name: 'Lightspeed', value: 'lightspeed' }
                  ]
              }),
              show: createBooleanOption({
                required:false,
              description: "Show the results non-ephemerally",
            }),
          }
)
@Declare({
  name: 'check',
  description: 'Check a link against various filters',
  contexts: ['BOT_DM', 'GUILD', 'PRIVATE_CHANNEL'],
  integrationTypes: ['GUILD_INSTALL', 'USER_INSTALL']
})
export default class FilterCheckCommand extends Command {

  async run(ctx: CommandContext) {
    const re = new RegExp("^(?:https?:\/\/)?(?:www\.)?([^\/]+)");
    // @ts-ignore
    let url = re.exec(ctx.options.url)[1];
    
    const embed = new Embed();
    embed.setColor('Green')
    embed.setTitle(`Results for ${url}:`)
    embed.setDescription("Loading...")
    await ctx.editOrReply({
        embeds:[embed],
        // @ts-ignore
        flags:ctx.options.show ? undefined : MessageFlags.Ephemeral 
      });
      embed.setDescription("")
    embed.setColor('Blue')

    // @ts-ignore
    if (!ctx.options.filter || ctx.options.filter == "all") {
        
        let results = [await filters.fortiguard(url),await filters.lightspeed(url),await filters.palo(url)]
        let formatted = ["Category: " + results[0],`LS Filter: ${results[1][0]}\nLS Rocket: ${results[1][1]}`,`Risk: ${results[2][1]}\nCategory: ${results[2][0].trim().replace(/^\s*$(?:\r\n?|\n)/gm,"")}`]
        embed.addFields({name:"FortiGuard",value:formatted[0]},{name:"Lightspeed",value:formatted[1]},{name:"Palo Alto",value:formatted[2]})
    } else {
        let results;
        // @ts-ignore
        switch (ctx.options.filter) {
            case "palo":
                results = await filters.palo(url);
                embed.addFields({name:"Palo Alto",value:`Risk: ${results[1]}\nCategory: ${results[0].trim().replace(/^\s*$(?:\r\n?|\n)/gm,"")}`})
                break;
            case "lightspeed":
                results = await filters.lightspeed(url);
                embed.addFields({name:"Lightspeed",value:`LS Filter: ${results[0]}\nLS Rocket: ${results[1]}`})
                break;
            case "fortiguard":
                results = await filters.fortiguard(url);
                embed.addFields({name:"FortiGuard",value:"Category: " + results})
                break;
            default:
                embed.setDescription("No filter passed")
                break;
        }
    }
    
    await ctx.editOrReply({
      embeds:[embed],
      flags:MessageFlags.Ephemeral
    });
  }
}