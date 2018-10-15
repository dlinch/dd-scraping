const cheerio = require('cheerio');
const pd = require('pretty-data').pd;
const request = require('request');

function simpleScrape(url) {
  request(url, function(err, resp, html) {
    if (err) {
      console.error(err);
      return;
    }

    const $ = cheerio.load(html);
    console.log(pd.xml($.html()));
    // Do something with the data

    // - Save to datastore
    // - Write to a CSV or Xcel file
    // - Massage and send off to another service
  })
}

simpleScrape('https://www.google.com');
