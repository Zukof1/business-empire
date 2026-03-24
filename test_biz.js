const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

    const filePath = 'file:///' + path.resolve('index.html').replace(/\\\\/g, '/');
    console.log('Navigating to', filePath);
    await page.goto(filePath);
    
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('Clicking work button to build balance...');
    for (let i = 0; i < 110; i++) {
        await page.click('#workBtn');
    }
    
    const balance = await page.$eval('#balanceDisplay', el => el.innerText);
    console.log('Balance reaches:', balance);
    
    await page.waitForSelector('#businessesList button');
    
    const countBefore = await page.$eval('#storeCountDisplay', el => el.innerText);
    console.log('Count before purchase:', countBefore);
    
    console.log('Attempting to click Retail Syndicate (first business button)...');
    await page.click('#businessesList button:first-child');
    
    await new Promise(r => setTimeout(r, 500));
    const balanceAfter = await page.$eval('#balanceDisplay', el => el.innerText);
    const countAfter = await page.$eval('#storeCountDisplay', el => el.innerText);
    
    console.log('Balance after purchase:', balanceAfter);
    console.log('Count after purchase:', countAfter);
    
    await browser.close();
})();
