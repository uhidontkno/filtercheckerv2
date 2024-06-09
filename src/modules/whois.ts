export async function getRDAP(ipv4Address: string): Promise<string | null> {
    try {
        const response = await fetch('https://data.iana.org/rdap/ipv4.json');
        if (!response.ok) {
            throw new Error('Failed to fetch RDAP data');
        }
        
        const rdapData = await response.json();
        const ipv4Services: Array<Array<string | Array<string>>> = rdapData.services;
        
        for (const service of ipv4Services) {
            const cidrRanges: Array<string> = service[0] as Array<string>;
            const endpoints: Array<string> = service[1] as Array<string>;
            
            for (let i = 0; i < cidrRanges.length; i++) {
                const cidrRange = cidrRanges[i];
                if (ipv4Address.startsWith(cidrRange)) {
                    return endpoints[0]; // should be https
                }
            }
        }
        return null; 
    } catch (error) {
        console.error('Error fetching RDAP data:', error);
        return null;
    }
}
