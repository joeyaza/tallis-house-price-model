# tallis-house-price-model

## What is this?

A web scraper and linear regression model to calculate the price of a house in an area of Southern Stockholm.

### The Scraper

Scrapes Hemnet.com with a specific locale and returns data on sold property prices in this area. Data such as sale price, size, garden size, number of rooms.
It saves this data in the /data folder as a json file once ran.
Can be ran with Node using  

```npm run start```

### The Notebook

The notebook in /notebooks folder has some data wrangling and cleaning of the data scraped above. It then provides a linear regression model, with the input data largely being the data scraped and the output/ target as price. There are 2 models, one specifically looking at all property for sale and one for 2021.

This needs cleaning up a lot but the jist is there.