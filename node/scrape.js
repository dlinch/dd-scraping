// import fs from 'fs';
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const prompt = require('prompt-async');
const request = require('request');
const pd = require('pretty-data').pd;

async function scrape(url = null) {
  if (!url) url = await get_prompt();

  const response = await fetch(url);
  const body = await response.text();  
  const $ = cheerio.load(body);

  console.log(pd.xml($.html()));
  return;
}

async function get_prompt() {
  const schema = {
    properties: {
      url:  {
        pattern: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        message: 'not a valid url',
        required: true,
      },
    },
  }

  prompt.start();
  const {url} = await prompt.get(schema);
  return url;
}

function simpleScrape(url) {
  request(url, function(err, resp, html) {
    if (err) {
      console.error(err);
      return;
    }

    const $ = cheerio.load(html);
    console.log(html);
  })
}

// scrape('https://www.google.com');
scrape();
// simpleScrape('https://www.google.com');