import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
export default class DataExtractor {
    constructor(tallkrogenSoldUrl, logger) {
        this.tallkrogenSoldUrl = tallkrogenSoldUrl;
        this.logger = logger;
        this.salesData = [];
        this.filePath = "../data/salesData.json";
    }
    async getSoldPropertyData() {
        await Array.from({ length: await this.getNumberOfPages() }, (_, i) => i + 1).forEach(async (pageNumber) => {
            const { data: websiteData } = await axios.get(`${this.tallkrogenSoldUrl}${pageNumber}`), property = cheerio.load(websiteData)("li.sold-results__normal-hit");
            await property.each(await this.extractFromPage.bind(this));
            this.logger.info("Data extracted from page:", pageNumber);
        });
    }
    ;
    async getNumberOfPages() {
        try {
            const { data: websiteData } = await axios.get(this.tallkrogenSoldUrl + 1), $ = cheerio.load(websiteData), lastPage = $("div.pagination__item").last().prev().text().replace(/\s+/g, '');
            this.logger.info("number of pages to extract from:", lastPage);
            return Number(lastPage);
        }
        catch (error) {
            throw Error(error.message);
        }
    }
    ;
    async extractFromPage(id, el) {
        const $ = cheerio.load(el), { data: propertyData } = await axios.get($("a").attr('href')), $$ = cheerio.load(propertyData), soldPrice = $$("span.sold-property__price-value")
            .text()
            .replace("kr", "")
            .replace(/\s+/g, ''), askingPrice = $$("dd.sold-property__attribute-value")
            .eq(1)
            .text()
            .replace("kr", "")
            .replace(/\s+/g, ''), houseType = $$('*:contains("Bostadstyp"):last')
            .next()
            .text()
            .replace(/\s+/g, ''), assignment = $$('*:contains("Upplåtelseform"):last')
            .next()
            .text()
            .replace(/\s+/g, ''), rooms = $$('*:contains("rum"):last')
            .text()
            .replace('rum', "")
            .replace(/\s+/g, ''), livingArea = $$('*:contains("Boarea"):last')
            .next()
            .text()
            .replace("m²", '')
            .replace(/\s+/g, ''), extraArea = $$('*:contains("Biarea"):last')
            .next()
            .text()
            .replace("m²", '')
            .replace(/\s+/g, ''), land = $$('*:contains("Tomtarea"):last')
            .next()
            .text()
            .replace("m²", '')
            .replace(/\s+/g, ''), address = $$("h1.hcl-heading--size1")
            .text()
            .replace("Slutpris", "")
            .replace(/\s+/g, '')
            .split(/(\d+)/), soldDate = $$(".qa-sold-property-metadata time").attr('datetime');
        await this.salesData.push({
            address: `${address[0]} ${address[1]}`,
            soldDate,
            livingArea,
            extraArea,
            land,
            rooms,
            houseType,
            assignment,
            askingPrice,
            soldPrice,
        });
        this.sleep(5000);
        await this.writeToFile(this.salesData);
    }
    async writeToFile(data) {
        try {
            await fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
        }
        catch (error) {
            throw Error(error.message);
        }
    }
    async sleep(waitTimeInMs) {
        new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    }
}
//# sourceMappingURL=DataExtractor.js.map