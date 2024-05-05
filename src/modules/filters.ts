import cheerio from 'cheerio';

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

// FortiGuard
async function fortiguard(url:string) {
    let res = await fetch("https://www.fortiguard.com/learnmore/dns",{
        "method":"POST",
        "headers": {
            'accept':
            '*/*',
            'accept-language':
            'en-US,en;q=0.9',
            'authority':
            'www.fortiguard.com',
            'content-type':
            'application/json;charset=UTF-8',
            'cookie':
            'cookiesession1=678A3E0F33B3CB9D7BEECD2B8A5DD036; privacy_agreement=true',
            'origin':
            'https://www.fortiguard.com',
            'referer':
            'https://www.fortiguard.com/services/sdns',
            'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        "body": `{{"value": "${url}", "version": 9}}`
    })
    let rJson = await res.json();
    return rJson["dns"]["categoryname"]
}

// Palo Alto

async function palo(domain: string): Promise<any> {
    try {
        const res = await fetch(`https://urlfiltering.paloaltonetworks.com/single_cr/?url=${domain}`);
        const html = await res.text();
        const c = cheerio.load(html);
        return [c(`*[for="id_new_category"]`).eq(2).parent().find(".form-text").text().trim(),c(`*[for="id_new_category"]`).eq(1).parent().find(".form-text").text().trim()]
    } catch (error) {
        console.error('Error fetching or parsing the HTML:', error);
        return ''; // Return an empty string in case of error
    }
}