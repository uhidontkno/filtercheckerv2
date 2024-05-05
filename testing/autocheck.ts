import { stdin } from "bun";
import filters from "../src/modules/filters.ts";
let inp:any = await stdin.text()
inp = inp.split("\n")
for (let i = 0; i < inp.length; i++) {
    let p = await filters.palo(inp[i])
    p = [p[0].replaceAll("  ","").replaceAll("\n",""),p[1]]
    console.log(`\n${inp[i]}:\n lightspeed: ${await filters.lightspeed(inp[i])}\n forti: ${await filters.fortiguard(inp[i])}\n palo: ${p}`)
}