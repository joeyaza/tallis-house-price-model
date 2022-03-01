import DataExtractor from "./DataExtractor";
const tallkrogenSoldUrl = "https://www.hemnet.se/salda/bostader?item_types%5B%5D=villa&location_ids%5B%5D=473428&page=";
const dataExtractor = new DataExtractor(tallkrogenSoldUrl);
await dataExtractor.start();
//# sourceMappingURL=index.js.map