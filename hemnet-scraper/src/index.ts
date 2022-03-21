import  DataExtractor  from "./DataExtractor";
import log from 'loglevel';
log.enableAll()

const tallkrogenSoldUrl: string = "https://www.hemnet.se/salda/bostader?item_types%5B%5D=villa&location_ids%5B%5D=473428&page=";
const dataExtractor: DataExtractor = new DataExtractor(tallkrogenSoldUrl, log);
log.info("STARTING!");

await dataExtractor.getSoldPropertyData();

