const axios = require('axios'); 
const cheerio = require('cheerio'); 
const fs = require('fs');


(async () =>  {

    const salesData = [],
      tallkrogenSoldUrl = "https://www.hemnet.se/salda/bostader?location_ids%5B%5D=473428&page=";


    const getNumberOfPages = async () => {

        const {data: websiteData}  = await axios.get(tallkrogenSoldUrl + 1),
            $ = cheerio.load(websiteData),
            lastPage = $("div.pagination__item").last().prev().text().replace(/\s+/g, '');

        return lastPage;
            
    };

    const convertDate = (date) => {

        const month = {
            "januari": 01,
            "februari": 02, 
            "mars": 03,
            "april": 04,
            "maj": 05,
            "juni": 06,
            "juli": 07,
            "augusti": 08,
            "september": 09,
            "oktober": 10, 
            "november": 11,
            "december": 12
        }

        return `${date[13]}/${month[date[14]]}/${date[15]}`;

    }

    const writeFile = (data, filePath = "../data/salesData.json") => {

        try {
            
            fs.writeFileSync(filePath, JSON.stringify(data));
            
        } catch(error) {

            console.log(error);

        }

    };



    Array.from({length: await getNumberOfPages()}, (_, i) => i + 1).forEach( async (pageNumber) => {


        const {data: websiteData}  = await axios.get(`${tallkrogenSoldUrl}${pageNumber}`),
                $ = cheerio.load(websiteData),
                property = $("li.sold-results__normal-hit")
            
        property.each((idx, el) => {

            const $ = cheerio.load(el); 

            const address = $("h2.qa-selling-price-title").text().replace(/\s+/g, '').split(/(\d+)/),
                    details = $("div.sold-property-listing__area").text().replace(/\s+/g, '').split("m²"),
                    houseArea = parseInt(details[0], 10),
                    rooms = details[1] ? details[1].replace('rum','') : "",
                    land = $("div.sold-property-listing__land-area").text().replace('m² tomt','').replace(/\s+/g, '').replace(/(\r\n|\n|\r)/gm, ""),
                    soldPrice = $("div.sold-property-listing__price div.sold-property-listing__subheading")
                                .text()
                                .replace("Slutpris", "")
                                .replace("kr", "")
                                .replace(/\s+/g, ''),
                    soldDate = $("div.sold-property-listing__sold-date").text().replace(/(\r\n|\n|\r)/gm, "").split(" ");

            salesData.push({
                address: `${address[0]} ${address[1]}`,
                houseArea,
                rooms,
                land,
                soldPrice,
                soldDate: convertDate(soldDate)
            });
            
            
        });


        writeFile(salesData)
            
    });


})()
