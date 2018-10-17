const fs = require('fs');
const puppeteer = require('puppeteer');
const json2csv = require('json2csv').parse;
// puppeteer documentation: https://github.com/GoogleChrome/puppeteer/blob/v1.2.0/docs/api.md#pagemainframe
// json2csv documentation: https://www.npmjs.com/package/json2csv

async function scrape(url) {
  // Spin up browser instance
  const browser = await puppeteer.launch({
    headless: true,
  });

  // Navigate to page
  const page = await browser.newPage();
  await page.goto(url);
  // await screenshot(page, 'careers_page');
  // await toPdf(page, 'careers_page');

  // Scrape data
  let data = [];
  const jobs = page.$$('section.Engineering li.job');

  jobs.forEach(async (job) => {
    await Promise.all([
      await page.waitForNavigation(),
      await job.click(),
    ]);
    await screenshot(page, 'job_page');
    scrapedJob = {};
    scrapedJob.title = await page.$('div.posting-headline h2').innerText;
    scrapedJob.location = await page.$('div.posting-categories div.sort-by-time').innerText;
    scrapedJob.commitment = await page.$('div.posting-categories div.sort-by-commitment').innerText;
    data.push(scrapedJob);
    await Promise.all([
      await page.waitForNavigation(),
      await page.goBack(),
    ]);
  });

  // Save data to csv
  const csv = parseCSV(data);
  write(csv);
  await browser.close();
}

async function screenshot(page, name) {
  await page.screenshot({path: `screenshots/${name}_screenshot.png`, type: 'png', fullPage: true});
}

async function toPdf(page, name) {
  await page.pdf({path: `${name}.pdf`, format: 'A4'});
}

function fields() {
  return [
    'title',
    'location',
    'commitment',
  ];
}

function parseCSV(data) {
  const fields = fields();
  const opts = { fields };

  try {
    const csv = json2csv(data, opts);
    return csv;
  } catch (err) {
    console.error(err);
  }
}

function write(csv) {
  const fileLocation = `csv/${this.city}_jobs.csv`;
  const stream = fs.createWriteStream(fileLocation);
  stream.once('open', function(_fd) {
    stream.write(csv);
    stream.end();
  });
}

scrape('https://www.lever.co/careers');
