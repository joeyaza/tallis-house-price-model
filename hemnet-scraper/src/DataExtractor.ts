import { throws } from "assert";
import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import ISalesData from "./ISalesData"

export default class DataExtractor {

	private salesData: ISalesData[] = [];
	private filePath: string = "../data/salesData.json"


    constructor(private tallkrogenSoldUrl: string,
                private logger: any
    		   ) {}

	public async getSoldPropertyData() {

		await Array.from({length: await this.getNumberOfPages()}, (_, i) => i + 1).forEach( async (pageNumber) => {

			const {data: websiteData}  = await axios.get(`${this.tallkrogenSoldUrl}${pageNumber}`),
					property = cheerio.load(websiteData)("li.sold-results__normal-hit");

			await property.each(await this.extractFromPage.bind(this));
			this.logger.info("Data extracted from page:", pageNumber);

		});

	};

	private async getNumberOfPages(): Promise<number> {

		try {

			const {data: websiteData} = await axios.get(this.tallkrogenSoldUrl + 1),
					$ = cheerio.load(websiteData),
					lastPage = $("div.pagination__item").last().prev().text().replace(/\s+/g, '');

			this.logger.info("number of pages to extract from:", lastPage);

			return Number(lastPage);


		} catch(error) {

			throw Error(error.message);


		}

	};


    private async extractFromPage(id: number, el: any) {

        const $ = cheerio.load(el),
            {data: propertyData}  = await axios.get($("a").attr('href')),
            $$ = cheerio.load(propertyData),

            soldPrice = $$("span.sold-property__price-value")
                    .text()
                    .replace("kr", "")
                    .replace(/\s+/g, ''),
            askingPrice = $$("dd.sold-property__attribute-value")
                        .eq(1)
                        .text()
                        .replace("kr", "")
                        .replace(/\s+/g, ''),
            houseType = $$("dd.sold-property__attribute-value")
                        .eq(3)
                        .text()
                        .replace(/\s+/g, ''),
            assignment = $$("dd.sold-property__attribute-value")
                        .eq(4)
                        .text()
                        .replace(/\s+/g, ''),
            rooms = $$("dd.sold-property__attribute-value")
                        .eq(5)
                        .text()
                        .replace('rum',"")
                        .replace(/\s+/g, ''),
            livingArea = $$("dd.sold-property__attribute-value")
                        .eq(6)
                        .text()
                        .replace("m²", '')
                        .replace(/\s+/g, ''),
            extraArea = $$("dd.sold-property__attribute-value")
                        .eq(7)
                        .text()
                        .replace("m²", '')
                        .replace(/\s+/g, ''),
            land = $$("dd.sold-property__attribute-value")
                    .eq(8)
                    .text()
                    .replace("m²", '')
                    .replace(/\s+/g, ''),
            address =  $$("h1.hcl-heading--size1")
                        .text()
                        .replace("Slutpris", "")
                        .replace(/\s+/g, '')
                        .split(/(\d+)/),
            soldDate = $$(".qa-sold-property-metadata time").attr('datetime');

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


    private async writeToFile(data: any) {

        try {

			await fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
            
        } catch(error) {

            throw Error(error.message);

        }

    }

    private async sleep(waitTimeInMs: number){


        new Promise(resolve => setTimeout(resolve, waitTimeInMs));

    }


}