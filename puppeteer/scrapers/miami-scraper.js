let BaseScraper = require('../base_scraper')

class MiamiScraper extends BaseScraper {
  constructor(options) {
    super(options)
    this.headless = false;
  }

  async scrape() {
    try {
      await this.screenshot(this.homePage);
      await this.homePage.click('#tblNEOGOVSearchCriteria > fieldset > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > a:nth-child(2)')
      let data = {};

      await this.closeBrowser();
      return data;
    } catch (err) {
      await this.closeBrowser();
      console.error(err)
    }
  }
}

const scraper = new MiamiScraper({url: 'http://www.miamibeachfl.gov/city-hall/human-resources/how-to-apply/current-job-postings/', city: 'Miami'});
scraper.perform();


