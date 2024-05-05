import Elysia from "elysia";
const app = new Elysia();
app.get("/",()=>{
    return "OK"
})
app.get("/ping",()=>{
    return "OK"
})

console.log(`Listening on port: ${process.env.port || 10000}`)
app.listen(process.env.port || 10000)