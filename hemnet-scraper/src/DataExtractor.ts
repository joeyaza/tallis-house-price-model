import axios from "axios";
import cheerio from "cheerio";
import * as fs from "fs";

export default class DataExtractor {


    constructor(private tallkrogenSoldUrl: string) {

    }

    public async start() {

        const numberOfPages: string = await this.getNumberOfPages();

        console.log(numberOfPages);



    }

    private async getNumberOfPages(): Promise<string> {

        try {

            const {data: websiteData} = await axios.get(this.tallkrogenSoldUrl + 1),
                  $ = cheerio.load(websiteData),
                  lastPage = $("div.pagination__item").last().prev().text().replace(/\s+/g, '');

            return lastPage;


        } catch(error) {

            throw Error(error.message);


        }


    };

    private writeFile(data: any, filePath: any) {

        try {
            
            fs.writeFileSync(filePath, JSON.stringify(data));
            
        } catch(error) {

            throw Error(error.message);

        }

    };


}