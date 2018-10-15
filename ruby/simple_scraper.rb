require 'nokogiri'
require 'httparty'

class SimpleScraper
  def initialize(url)
    @url = url
  end

  def perform
    page = HTTParty.get(@url)
    parsed_page = Nokogiri::HTML(page)

    puts parsed_page
  end
end

SimpleScraper.new('https://google.com').perform