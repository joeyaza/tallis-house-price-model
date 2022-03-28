import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import {IForSaleData, ISoldData} from "./IPropertyData"

export default class DataExtractor {

	private forSaleData: IForSaleData[] = [];
	private soldData: ISoldData[] = [];

	constructor(private logger: any
			   ) {}

	public async getSoldPropertyData(soldPropertyUrl: string): Promise<void> {

		await Array.from({length: await this.getNumberOfPages(soldPropertyUrl)}, (_, i) => i + 1).forEach( async (pageNumber) => {

			const {data: websiteData}  = await axios.get(`${soldPropertyUrl}${pageNumber}`),
					property = cheerio.load(websiteData)("li.sold-results__normal-hit");

			await property.each(await this.extractFromPage.bind(this, "sold"));

		});

	}

	public async getForSalePropertyData(forSalePropertyUrl: string): Promise<void> {

		const {data: websiteData}  = await axios.get(forSalePropertyUrl),
			  property = cheerio.load(websiteData)("li.js-normal-list-item");

		await property.each(await this.extractFromPage.bind(this, "forSale"));

	}

	private async getNumberOfPages(soldPropertyUrl: string): Promise<number> {

		try {

			const {data: websiteData} = await axios.get(soldPropertyUrl + 1),
				  $ = cheerio.load(websiteData),
				  lastPage = $("div.pagination__item").last().prev().text().replace(/\s+/g, '');

			this.logger.info("number of pages to extract from:", lastPage);

			return Number(lastPage);

		} catch(error) {

			throw Error(error.message);

		}

	}

	private async extractFromPage(exchange: string, id: number, el: any): Promise<void> {

		const $ = cheerio.load(el),
			  {data: propertyData}  = await axios.get($("a").attr('href')),
			  $$ = cheerio.load(propertyData);

		(exchange === "sold") ?  await this.saveSoldData($$) : await this.saveForSaleData($$) 

	}

	private async saveSoldData($$: any) {

		const soldPrice = $$("span.sold-property__price-value")
						.text()
						.replace("kr", "")
						.replace(/\s+/g, ''),
			askingPrice = $$("dd.sold-property__attribute-value")
						.eq(1)
						.text()
						.replace("kr", "")
						.replace(/\s+/g, ''),
			houseType = $$('*:contains("Bostadstyp"):last')
						.next()
						.text()
						.replace(/\s+/g, ''),
			assignment = $$('*:contains("Upplåtelseform"):last')
						.next()
						.text()
						.replace(/\s+/g, ''),
			rooms = $$('*:contains("rum"):last')
						.text()
						.replace('rum',"")
						.replace(/\s+/g, ''),
			livingArea = $$('*:contains("Boarea"):last')
						.next()
						.text()
						.replace("m²", '')
						.replace(/\s+/g, ''),
			extraArea = $$('*:contains("Biarea"):last')
						.next()
						.text()
						.replace("m²", '')
						.replace(/\s+/g, ''),
			land = $$('*:contains("Tomtarea"):last')
						.next()
						.text()
						.replace("m²", '')
						.replace(/\s+/g, ''),
			address =  $$("h1.hcl-heading--size1")
						.text()
						.replace("Slutpris", "")
						.replace(/\s+/g, '')
						.split(/(\d+)/),
			soldDate = $$(".qa-sold-property-metadata time").attr('datetime');

		await this.soldData.push({
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
		await this.writeToFile(this.soldData, "sold");

	}


	private async saveForSaleData($$: any) {
				
		const askingPrice = $$("p.property-info__price")
						.text()
						.replace("kr", "")
						.replace(/\s+/g, ''),
				houseType = $$('*:contains("Bostadstyp"):last')
						.next()
						.text()
						.replace(/\s+/g, ''),
				assignment = $$('*:contains("Upplåtelseform"):last')
						.next()
						.text()
						.replace(/\s+/g, ''),
				rooms = $$('*:contains("rum"):last')
						.text()
						.replace('rum',"")
						.replace(/\s+/g, ''),
				livingArea = $$('*:contains("Boarea"):last')
						.next()
						.text()
						.replace("m²", '')
						.replace(/\s+/g, ''),
				extraArea = $$('*:contains("Biarea"):last')
						.next()
						.text()
						.replace("m²", '')
						.replace(/\s+/g, ''),
				land = $$('*:contains("Tomtarea"):last')
						.next()
						.text()
						.replace("m²", '')
						.replace(/\s+/g, ''),
				address =  $$("h1.hcl-heading--size2")
						.text()
						.replace("Slutpris", "")
						.replace(/\s+/g, '')
						.split(/(\d+)/);

		await this.forSaleData.push({
				address: `${address[0]} ${address[1]}`,
				livingArea,
				extraArea,
				land,
				rooms,
				houseType,
				assignment,
				askingPrice
			});
		this.sleep(5000);
		await this.writeToFile(this.forSaleData, "forSale");
	}

	private async writeToFile(data: any, filePath: string): Promise<void> {

		try {

			await fs.writeFileSync(`../data/${filePath}Data.json`, JSON.stringify(data, null, 2));
			
		} catch(error) {

			throw Error(error.message);

		}

	}

	private async sleep(waitTimeInMs: number): Promise<void> {

		new Promise(resolve => setTimeout(resolve, waitTimeInMs));

	}

}