import DataExtractor from "./DataExtractor";
import log from 'loglevel';
log.enableAll()

const soldPropertyUrl: string = "https://www.hemnet.se/salda/bostader?item_types%5B%5D=villa&location_ids%5B%5D=473428&page=",
	  forSalePropertyUrl: string = "https://www.hemnet.se/bostader?housing_form_groups%5B%5D=houses&location_ids%5B%5D=473428",
	  dataExtractor: DataExtractor = new DataExtractor(log);
log.info("STARTING!");

await dataExtractor.getSoldPropertyData(soldPropertyUrl);

if (process.argv.slice(2)[0] === "for-sale") {
	await dataExtractor.getForSalePropertyData(forSalePropertyUrl);
}

