FROM python:3.4.9

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN pip install scrapy
RUN pip install beautifulsoup4

EXPOSE 8080