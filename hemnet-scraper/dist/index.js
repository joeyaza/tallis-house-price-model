import DataExtractor from "./DataExtractor";
import log from 'loglevel';
log.enableAll();
const soldPropertyUrl = "https://www.hemnet.se/salda/bostader?item_types%5B%5D=villa&location_ids%5B%5D=473428&page=", forSalePropertyUrl = "https://www.hemnet.se/bostader?housing_form_groups%5B%5D=houses&location_ids%5B%5D=473428", dataExtractor = new DataExtractor(log);
log.info("STARTING!");
await dataExtractor.getSoldPropertyData(soldPropertyUrl);
if (process.argv.slice(2)[0] === "predict") {
    await dataExtractor.getForSalePropertyData(forSalePropertyUrl);
}
//# sourceMappingURL=index.js.map