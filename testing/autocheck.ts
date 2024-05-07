import { stdin } from "bun";
import filters from "../src/modules/filters.ts";
let inp:any = await stdin.text()
inp = inp.split("\n")
const re = new RegExp("(?:https?://)?([^/]+)");

for (let i = 0; i < (inp.length - 1); i++) {
    // @ts-ignore
    let url = re.exec(inp[i])[1];
    let results = [await filters.fortiguard(url),await filters.lightspeed(url),await filters.palo(url)]
    results[2] = [results[2][0].replaceAll("  ","").replaceAll("\n",""),results[2][1]]
    console.log(`\n${url}:\n lightspeed: ${results[1]}\n forti: ${results[0]}\n palo: ${results[2]}`)
}