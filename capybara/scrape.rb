require 'selenium-webdriver'
require 'nokogiri'
require 'capybara'

Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, browser: :chrome)
end

Capybara.javascript_driver = :chrome
Capybara.configure do |config|
  config.default_max_wait_time = 3
  config.default_driver = :selenium
end

session = Capybara.current_session
driver = session.driver.browser
session.visit "https://www.lever.co/careers"

session.find('h1')
job_count = session.find_all('section.Engineering li.job').count
puts job_count
data = []

job_count.times do |i|
  job = session.find_all('section.Engineering li.job')[i]
  job.click_link
  scraped_job = {}
  scraped_job[:title] = session.find('.posting-headline h2').text
  scraped_job[:location] = session.find('div.posting-categories div.sort-by-time').text
  scraped_job[:commitment] = session.find('div.posting-categories div.sort-by-commitment').text
  data << scraped_job
  session.go_back
end


pp data

