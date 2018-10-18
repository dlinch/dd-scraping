const fs = require('fs');
const puppeteer = require('puppeteer');
const json2csv = require('json2csv').parse;

class BaseScraper {
  constructor(options) {
    this.city = options.city;
    this.url = options.url;
    this.headless = typeof options.headless === 'boolean' ?
                            options.headless : true;
  }

  async initBrowser() {
    try {
      const browser = await puppeteer.launch({
        headless: this.headless,
      });
      const page = await browser.newPage();
      await page.goto(this.url);

      this.browser = browser;
      this.homePage = page;
    } catch (err) {
      await this.close();
      console.error(err);
    }
  }
  
  async closeBrowser() {
    await this.browser.close();
  }
  
  get fields() {
    return [
      'id',
      'name',
      'address',
      'city',
      'state',
      'zip_code',
      'url',
      'description',
      'category_id',
      'salaries',
      'featured',
      'created_at',
      'updated_at',
      'sort_group',
      'sort_letter',
    ]  
  }
  
  parseCSV(data) {
    const fields = this.fields;
    const opts = { fields };

    try {
      const csv = json2csv(data, opts);
      return csv;
    } catch (err) {
      console.error(err);
    }
  }
  
  async perform() {
    await this.initBrowser();
    let data = await this.scrape();
    console.log('received data', data);
    // const csv = this.parseCSV(data);
    // this.write(csv)
  }
  
  async screenshot(page) {
    await page.screenshot({path: `screenshots/${this.city}_screenshot.png`, type: 'png', fullPage: true});
  }
  
  write(csv) {
    const fileLocation = `csv/${this.city}_jobs.csv`
    const stream = fs.createWriteStream(fileLocation);
    stream.once('open', function(fd) {
      stream.write(csv);
      stream.end();
    });
  }
}

module.exports = BaseScraper;
