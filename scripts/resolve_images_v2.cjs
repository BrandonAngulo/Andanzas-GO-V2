const https = require('https');

const files = [
    'File:Museo_la_tertulia.JPG',
    'File:Teatro_Municipal_de_Cali_-Panorama-.JPG',
    'File:Cristo_Rey,_Cali.JPG'
];

function getUrl(title) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'commons.wikimedia.org',
            path: `/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`,
            method: 'GET',
            headers: { 'User-Agent': 'AndanzasGoBot/1.0 (test@example.com)' }
        };

        https.get(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const pages = json.query.pages;
                    const pageId = Object.keys(pages)[0];
                    if (pageId === '-1') resolve(null);
                    else resolve(pages[pageId].imageinfo[0].url);
                } catch (e) {
                    console.error('Parse error:', data.substring(0, 100));
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    for (const title of files) {
        try {
            const url = await getUrl(title);
            console.log(`${title} => ${url}`);
        } catch (e) {
            console.error(e);
        }
    }
}

run();
