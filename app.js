const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const port = 3000;

    (async () => {
        app.get('/findCifraClub/:title', async (req, res) => {
            
            const cifraClubResults = await findCifraClub(req.params.title);

            res.send(cifraClubResults)
        })

        app.listen(port, () => {
            console.log("NodeAPI listening on port:",  port)
        })

        
    })();

async function findCifraClub(title) {

    const browser = await puppeteer.launch({ headless: true, timeout: 60000 });
        const page = await browser.newPage();

        await page.setDefaultNavigationTimeout(0); 
        
        const url = 'https://www.cifraclub.com.br/?q=' + title;

        console.log("URL da busca:", url);

        await page.goto(url);

        var cifraClubResults = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll('a.gs-title'),
                function (element) {
                    return { description: element.textContent, link: element.getAttribute('href') }
                }
            )
        );

        cifraClubResults = uniqByKeepFirst(cifraClubResults, x => x.description).filter(x => x.link != null);

        console.log(cifraClubResults)
        //await page.screenshot({path: 'example.png'});
        await browser.close();

        return cifraClubResults;
}   
function uniqByKeepFirst(a, key) {
    let seen = new Set();
    return a.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}