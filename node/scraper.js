const cheerio = require('cheerio');
const fetch = require('node-fetch');
const pd = require('pretty-data').pd;
const prompt = require('prompt-async');

async function scrape(url = null) {
  if (!url) url = await get_prompt();

  const response = await fetch(url);
  const body = await response.text();  
  const $ = cheerio.load(body);

  console.log(pd.xml($.html()));
  // Do something with the data
}

async function get_prompt() {
const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  const schema = {
    properties: {
      url:  {
        pattern: urlRegex,
        message: 'not a valid url',
        required: true,
      },
    },
  }

  prompt.start();
  const {url} = await prompt.get(schema);
  return url;
}

// scrape('https://www.google.com');
scrape();
