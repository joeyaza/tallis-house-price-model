import axios from "axios";
import cheerio from "cheerio";
import * as fs from "fs";
export default class DataExtractor {
    constructor(tallkrogenSoldUrl) {
        this.tallkrogenSoldUrl = tallkrogenSoldUrl;
    }
    async start() {
        const numberOfPages = await this.getNumberOfPages();
        console.log(numberOfPages);
    }
    async getNumberOfPages() {
        try {
            const { data: websiteData } = await axios.get(this.tallkrogenSoldUrl + 1), $ = cheerio.load(websiteData), lastPage = $("div.pagination__item").last().prev().text().replace(/\s+/g, '');
            return lastPage;
        }
        catch (error) {
            throw Error(error.message);
        }
        const { data: websiteData } = await axios.get(this.tallkrogenSoldUrl + 1), $ = cheerio.load(websiteData), lastPage = $("div.pagination__item").last().prev().text().replace(/\s+/g, '');
        return lastPage;
    }
    ;
    writeFile(data, filePath) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data));
        }
        catch (error) {
            throw Error(error.message);
        }
    }
    ;
}
//# sourceMappingURL=DataExtractor.js.map