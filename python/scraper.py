from bs4 import BeautifulSoup
import scrapy

class Scraper(scrapy.Spider):
    name = 'SimpleGoogleScraper'
    start_urls = ['https://www.google.com/search?q=scraping']

    def parse(self, response):
      soup = BeautifulSoup(response.text, 'lxml')
      headers = soup.find_all('h3')
      yield {
        "url": response.url,
        "headers": [h.get_text() for h in headers],
      } 
      # for next_page in response.css('a#pnnext'):
      #     yield response.follow(next_page, self.parse)
