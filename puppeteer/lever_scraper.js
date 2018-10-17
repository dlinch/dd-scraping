const fs = require('fs');
const puppeteer = require('puppeteer');
const json2csv = require('json2csv').parse;
// puppeteer documentation: https://github.com/GoogleChrome/puppeteer/blob/v1.2.0/docs/api.md#pagemainframe
// json2csv documentation: https://www.npmjs.com/package/json2csv

async function scrape(url) {
  try {
    // Spin up browser instance
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-dev-shm-usage'],
    });

    // Navigate to page
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "networkidle0"});
    // await screenshot(page, 'careers_page');
    // await toPdf(page, 'careers_page');

    // Scrape data
    await Promise.all([
      await page.waitForSelector('section.Engineering li.job a:first-of-type'),
      await page.click('section.Engineering li.job a:first-of-type'),
    ])

    await page.waitForSelector('div.posting-headline h2');
    // await screenshot(page, 'job_page');
    let scrapedJob = {};
    scrapedJob.title = await page.evaluate(() => document.querySelector('div.posting-headline h2').innerText);
    scrapedJob.location = await page.evaluate(() => document.querySelector('div.posting-categories div.sort-by-time').innerText);
    scrapedJob.commitment = await page.evaluate(() => document.querySelector('div.posting-categories div.sort-by-commitment').innerText);

    // Save data to csv
    const csv = parseCSV([scrapedJob]);
    write(csv, 'lever');
    await browser.close();
  } catch (e) {
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.error(e)
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    await browser.close();
  }
}

async function screenshot(page, name) {
  await page.screenshot({path: `screenshots/${name}_screenshot.png`, type: 'png', fullPage: true});
}

async function toPdf(page, name) {
  await page.pdf({path: `${name}.pdf`, format: 'A4'});
}

function parseCSV(data) {
  const fields = [
    'title',
    'location',
    'commitment',
  ];
  const opts = { fields };

  try {
    const csv = json2csv(data, opts);
    return csv;
  } catch (err) {
    console.error(err);
  }
}

function write(csv, name) {
  const fileLocation = `csv/${name}_jobs.csv`;
  const stream = fs.createWriteStream(fileLocation);
  stream.once('open', function(_fd) {
    stream.write(csv);
    stream.end();
  });
}

scrape('https://www.lever.co/careers');
