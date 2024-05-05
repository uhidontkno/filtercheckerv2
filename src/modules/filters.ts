// Lightspeed
async function lightspeedCategorize(num: number) {
    let jFile:Blob = Bun.file("src/modules/lightspeed.json")
    let catJson = await jFile.json();
    for (let i = 0; i > catJson.length;i++) {
        if (catJson[i]["CategoryName"] == num) {
            return catJson[i]["CategoryName"]
        }
    }
    return num // No category
}

async function lightspeed(url:string) {
    let res = await fetch("https://production-archive-proxy-api.lightspeedsystems.com/archiveproxy",
        {
            "method":"POST",
            "headers": {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9',
                'authority': 'production-archive-proxy-api.lightspeedsystems.com',
                'content-type': 'application/json',
                'origin': 'https://archive.lightspeedsystems.com',
                'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'x-api-key': 'onEkoztnFpTi3VG7XQEq6skQWN3aFm3h'
            },
            // graphQL vvv
            "body": `{{"query":"\\nquery getDeviceCategorization($itemA: CustomHostLookupInput!, $itemB: CustomHostLookupInput!){{\\n  a: custom_HostLookup(item: $itemA) {{ cat}}\\n  b: custom_HostLookup(item: $itemB) {{ cat   \\n  }}\\n}}","variables":{{"itemA":{{"hostname":"{url}"}}, "itemB":{{"hostname":"{url}"}}}}}}`
        }
    );
    let body= await res.json();
    let cat = [body["data"]["a"]["cat"],body["data"]["b"]["cat"]]
    return [lightspeedCategorize(cat[0]),lightspeedCategorize(cat[1])]

}