import Elysia from "elysia";
import filters from "../modules/filters"
const app = new Elysia();
app.get("/",()=>{
    return "OK"
})
app.get("/ping",()=>{
    return "OK"
})

app.get("/check/:url/results.txt",async ({ params })=>{
    let url = params.url
    let results = [await filters.fortiguard(url),await filters.lightspeed(url),await filters.palo(url)]
    let formatted = ["FortiGuard:\nCategory: " + results[0] + "\n",`Lightspeed:\nLS Filter: ${results[1][0]}\nLS Rocket: ${results[1][1]}\n`,`Palo Alto:\nRisk: ${results[2][1]}\nCategory: ${results[2][0].trim().replace(/^\s*$(?:\r\n?|\n)/gm,"")}\n`]
    return `FilterChecker Report for ${url}:\n\n${formatted.join("\n")}`
})

app.get("/check/:url/results.json",async ({ params })=>{
    let url = params.url
    let results = [await filters.fortiguard(url),await filters.lightspeed(url),await filters.palo(url)]
    return {"fortiguard":results[0],"lightspeed":results[1],"paloalto":results[2]}
});
app.post("/check/:url/results.txt",async ({ params,body,set })=>{
    let _:any = body
    let bj = {"filter": "all"};
    try {
    bj = JSON.parse(_)
    } catch {
        set.status = 400;
        return "Bad JSON"
    }

    let url = params.url
    if (bj.filter == "all") {
    let results = [await filters.fortiguard(url),await filters.lightspeed(url),await filters.palo(url)]
    let formatted = ["FortiGuard:\nCategory: " + results[0] + "\n",`Lightspeed:\nLS Filter: ${results[1][0]}\nLS Rocket: ${results[1][1]}\n`,`Palo Alto:\nRisk: ${results[2][1]}\nCategory: ${results[2][0].trim().replace(/^\s*$(?:\r\n?|\n)/gm,"")}\n`]
    return `FilterChecker Report for ${url}:\n\n${formatted.join("\n")}`
    } else {
        let results; let formatted;
        switch (bj.filter) {
            case ("fortiguard" || "forti"):
                results = await filters.fortiguard(url)
                formatted = "FortiGuard:\nCategory: " + results[0]
                return `FilterChecker Report for ${url}:\n\n${formatted}`
            case ("lightspeed" || "ls"):
                results = await filters.lightspeed(url)
                formatted = `Lightspeed:\nLS Filter: ${results[0]}\nLS Rocket: ${results[1]}\n`
                return `FilterChecker Report for ${url}:\n\n${formatted}`
            case ("palo" || "paloalto") :
                results = await filters.palo(url)
                formatted = `Palo Alto:\nRisk: ${results[2][1]}\nCategory: ${results[2][0].trim().replace(/^\s*$(?:\r\n?|\n)/gm,"")}\n`
                return `FilterChecker Report for ${url}:\n\n${formatted}`
            default:
                set.status = 400
                return "Unknown filter. Accepted values: fortiguard, forti, lightspeed, ls, palo, paloalto"
        }
    }
})
app.post("/check/:url/results.json",async ({ params,body,set })=>{
    let _:any = body
    let bj = {"filter": "all"};
    try {
    bj = JSON.parse(_)
    } catch {
        set.status = 400;
        return {"error":"Bad JSON"}
    }

    let url = params.url
    if (bj.filter == "all") {
    let url = params.url
    let results = [await filters.fortiguard(url),await filters.lightspeed(url),await filters.palo(url)]
    return {"fortiguard":results[0],"lightspeed":results[1],"paloalto":results[2]}
    } else {
        switch (bj.filter) {
            case ("fortiguard" || "forti"):
                return {"fortiguard":await filters.fortiguard(url)}
            case ("lightspeed" || "ls"):
                return {"lightspeed":await filters.lightspeed(url)}
            case ("palo" || "paloalto") :
                return {"palo":await filters.palo(url)}
            default:
                set.status = 400
                return {"error":"Unknown filter. Accepted values: fortiguard, forti, lightspeed, ls, palo, paloalto"}
        }
    }
})

let port = 10000;
if (process.env.PORT) {port = Number(process.env.PORT)}
if (!isNaN(Number(process.argv[process.argv.length - 1]))) {port = Number(process.argv[process.argv.length - 1])}
console.log(`Listening on port: ${port}`)
app.listen(port)