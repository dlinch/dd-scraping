require 'nokogiri'
require 'httparty'
require 'csv'

class Scraper
  def initialize(url)
    @url = url
  end

  def perform
    page = HTTParty.get(@url)
    parsed_page = Nokogiri::HTML(page)
    data = parsed_page.css('h3').map(&:text)
    CSV.open('google_search_results.csv', 'w') { |csv| csv << data }

    puts data
  end
end

Scraper.new('https://www.google.com/search?q=scraping').perform