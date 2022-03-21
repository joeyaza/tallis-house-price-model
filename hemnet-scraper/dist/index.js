import DataExtractor from "./DataExtractor";
import log from 'loglevel';
log.enableAll();
const tallkrogenSoldUrl = "https://www.hemnet.se/salda/bostader?item_types%5B%5D=villa&location_ids%5B%5D=473428&page=";
const dataExtractor = new DataExtractor(tallkrogenSoldUrl, log);
log.info("STARTING!");
await dataExtractor.getSoldPropertyData();
//# sourceMappingURL=index.js.map