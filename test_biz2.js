const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

    const filePath = 'file:///' + path.resolve('index.html').replace(/\\\\/g, '/');
    await page.goto(filePath);
    await new Promise(r => setTimeout(r, 1000));
    
    for (let i = 0; i < 110; i++) {
        await page.click('#workBtn');
    }
    
    await page.waitForSelector('#businessesList button');
    
    // Check if it's disabled
    const isDisabled = await page.$eval('#businessesList button:first-child', btn => btn.disabled);
    console.log('Is Retail Syndicate disabled before purchase?', isDisabled);
    
    // Evaluate click directly
    await page.$eval('#businessesList button:first-child', btn => btn.click());
    
    await new Promise(r => setTimeout(r, 500));
    
    const balanceAfter = await page.$eval('#balanceDisplay', el => el.innerText);
    const countAfter = await page.$eval('#storeCountDisplay', el => el.innerText);
    
    console.log('Balance after purchase:', balanceAfter);
    console.log('Count after purchase:', countAfter);
    
    await browser.close();
})();
