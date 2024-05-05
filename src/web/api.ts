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
    let results = [await filters.fortiguard(url),await filters.lightspeed(url),await filters.palo(url)]
    let formatted = ["FortiGuard:\nCategory: " + results[0] + "\n",`Lightspeed:\nLS Filter: ${results[1][0]}\nLS Rocket: ${results[1][1]}\n`,`Palo Alto:\nRisk: ${results[2][1]}\nCategory: ${results[2][0].trim().replace(/^\s*$(?:\r\n?|\n)/gm,"")}\n`]
    return `FilterChecker Report for ${url}:\n\n${formatted.join("\n")}`
})


console.log(`Listening on port: ${process.argv[3] || process.env.PORT || 10000}`)
app.listen(process.argv[3] || process.env.PORT || 10000)